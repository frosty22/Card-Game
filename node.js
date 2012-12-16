/**
 * Require and run all tests.
 */
require("./tests/run.js");

/**
 * Require modules / classes for application process.
 */
var configuration = require("./config.js");
var Container = require("./libs/container.js");

var logger = require("./libs/logger.js");
var WebSocketServer = require('websocket').server;
var http = require('http');
var mysql = require("mysql");

var Player = require("./libs/player.js");
var Messenger = require("./libs/messenger.js");
var UserRepository = require("./libs/repositories/user.js");
var GameRepository = require("./libs/repositories/game.js");
var MatchContainer = require("./libs/matchContainer.js");

/**
 * Create global container with parameters and services store.
 * @type {Container}
 */
var globalContainer = new Container(configuration);


/**
 * Create node server for listening on port 8080
 */
logger.log("Create node server for listen on port 8080");
var server = http.createServer(function(request, response) {

    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();

});

server.listen(8080, function() {
    logger.log('Server is listening on port 8080');
});


/**
 * Create web socket server which listen on node server
 */
logger.log("Create web socket server which listen on node sever");
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


/**
 * Create connection to database for store data
 * and create disconnect handler for pernament's connection.
 */
function handleDisconnect(databaseConnection) {
	databaseConnection.on("error", function(err){
		if (!err.fatal)
			return;

		if (err.code !== 'PROTOCOL_CONNECTION_LOST')
			throw err;

		databaseConnection.createConnection(globalContainer.getParam("database"));
		handleDisconnect(databaseConnection);
		databaseConnection.connect();
		logger.log("Reconnect to the database");
	});
}
globalContainer.addService("database", mysql.createConnection(globalContainer.getParam("database")));
handleDisconnect(globalContainer.getService("database"));
globalContainer.getService("database").connect();
logger.log("Connected to the database");


globalContainer.setParam("clients", new Array());
globalContainer.addService("matches", new MatchContainer(globalContainer.getParam("match"), globalContainer.getService("database")));
globalContainer.addService("userRepository", new UserRepository(globalContainer.getService("database")));
globalContainer.addService("gameRepository", new GameRepository(globalContainer.getService("database")));

/**
 * Start WebSocket server on "ws" protocol
 */
wsServer.on('request', function(request) {

	/**
	 * Authorize request by origin.
	 */
	var allowedRequest = false;
	for(var i = 0; i < globalContainer.getParam("allowedOrigins").length; i++) {
		if(globalContainer.getParam("allowedOrigins")[i] == request.origin) allowedRequest = true;
	}

    if (!allowedRequest) {
      request.reject();
      logger.log('Connection from origin ' + request.origin + ' rejected.');
      return;
    }

	/**
	 * Connection accepted, we can create correct response.
	 */
    var connection = request.accept('echo-protocol', request.origin);
	var clientContainer = new Container();
	var messenger = new Messenger(connection);

	clientContainer.setParam("id", globalContainer.getParam("clients").push(connection) - 1);
    logger.log('Connection accepted.');


	// Event when message was received
    connection.on('message', function(message) {
		console.log("%j", message);
        if (message.type === 'utf8') {
        	var requestData = JSON.parse(message.utf8Data);

			logger.log("Received request from #" + clientContainer.getParam("id") + " on action: " + requestData.action);


			// Set active player to the match if exist
			if (clientContainer.hasService("player")) {
				clientContainer.getService("match").setConnectedPlayer(clientContainer.getService("player"));
			}


			// Request for join to the game
			if (requestData.action == "join") {

				globalContainer.getService("gameRepository").getGameByHash(requestData.game, function(gameRow){
					if (!gameRow) {
						messenger.sendError("Hra nebyla správně vytvořena.");
						return;
					}
					if (gameRow.state == 1) {
						messenger.sendError("Hra již započala.");
						return;
					}
					if (gameRow.state != 0) {
						messenger.sendError("Hra již skončila.");
						return;
					}

					var match = globalContainer.getService("matches").getByIndex(gameRow.id);
					if (!match)
						match = globalContainer.getService("matches").create(gameRow);

					if (!gameRow.user1) {
						globalContainer.getService("userRepository").getUserByHash(requestData.user, function(userRow){
							if (!userRow) {
								messenger.sendError("Hráč nebyl nalezen.");
								return;
							}

							clientContainer.addService("player", new Player(globalContainer.getParam("player"), messenger, userRow));
							match.addPlayer(clientContainer.getService("player"));
							match.setConnectedPlayer(clientContainer.getService("player"));
							clientContainer.addService("match", match);

							globalContainer.getService("gameRepository").setFirstUserToGame(gameRow.id, userRow.id);
							messenger.sendState("Čekám na spoluhráče.");
						});

						return;
					}

					if (!gameRow.user2) {
						globalContainer.getService("userRepository").getUserByHash(requestData.user, function(userRow){
							if (!userRow) {
								messenger.sendError("Hráč nebyl nalezen.");
								return;
							}

							if (gameRow.user1 == userRow.id) {
								messenger.sendError("Mnohonásobné připojení do hry.");
								return;
							}


							clientContainer.addService("player", new Player(globalContainer.getParam("player"), messenger, userRow));
							match.addPlayer(clientContainer.getService("player"));
							match.setConnectedPlayer(clientContainer.getService("player"));
							clientContainer.addService("match", match);

							globalContainer.getService("gameRepository").setSecondUserToGame(gameRow.id, userRow.id);

							var matchError = match.getStartError();
							if (matchError) {
								messenger.sendError(matchError);
								return;
							}

							match.start();
							globalContainer.getService("gameRepository").setStartedGame(gameRow.id);

							var opponent = match.getOpponentPlayer();
							var player = match.getConnectedPlayer();

							player.messenger.send("initPlayer", { 	username : player.username,
																 	life : player.life,
																	level : player.level,
																	maxLife : player.maxLife
																});
							player.messenger.send("initOpponent", {
																	username : opponent.username,
																	life : opponent.life,
																	level : opponent.level,
																	maxLife : opponent.maxLife
																});
							player.messenger.sendState("Hra začala");

							opponent.messenger.send("initPlayer", { username : opponent.username,
																	life : opponent.life,
																	level : opponent.level,
																	maxLife : opponent.maxLife
																});
							opponent.messenger.send("initOpponent", {
																	username : player.username,
																	life : player.life,
																	level : player.level,
																	maxLife : player.maxLife
																});
							opponent.messenger.sendState("Hra začala");

						});

						return;
					}

					messenger.sendError("Hra již je plná.");
				});


			}



        }
    });

	// Event when connection is closed
    connection.on('close', function(reasonCode, description) {
        logger.log('Peer ' + connection.remoteAddress + ' disconnected.');

		if (clientContainer.hasService("match") && clientContainer.hasService("player")) {
			var match = clientContainer.getService("match");
			match.setConnectedPlayer(clientContainer.getService("player"));

			if (!match.isEnded()) {
				match.end();
				match.getOpponentPlayer().messenger.send("winner", { type : 1 });
				globalContainer.getService("gameRepository").setEndedGame(match.id, match.getOpponentPlayer().id, match.experiences);
			}
			globalContainer.getService("matches").remove(match);
		}

		// Remove client from all connected clients
		globalContainer.getParam("clients").splice(clientContainer.getParam("id"), 1);
    });


});


