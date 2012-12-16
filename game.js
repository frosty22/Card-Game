$(document).ready(function(){

	/**
	 * Interval object with stability
	 */
	var stabilityInterval;

	/**
	 * Error handler
	 * @param {string} message
	 * @param {Connection} connection
	 */
	var errorHandler = function(message, connection) {
		$("#board").remove();
		$("#state").text(message).show();

		if (stabilityInterval) clearInterval(stabilityInterval);

		if (connection) {
			try {
				// WS bug fix in Safari
				connection.close();
			} catch (e) {
			}
		}
	};


	try {
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		var connection = new WebSocket('ws://' + config.ws, 'echo-protocol');

		/**
		 * Open connection with WS server
		 */
		connection.onopen = function () {
			connection.send(JSON.stringify({ action : "join", game : config.game, user : config.user }));
		};

		/**
		 * Error in connection
		 * @param error
		 */
		connection.onerror = function (error) {
			errorHandler(error, connection);

		};

		/**
		 * Event on message
		 * @param message
		 */
		connection.onmessage = function (message) {
			// try to decode json (I assume that each message from server is json)
			try {
				var requestData = JSON.parse(message.data);
			} catch (e) {
				console.log('This doesn\'t look like a valid JSON: ', message.data);
				return;
			}

			// handle when fatal error
			if (requestData.error) {
				errorHandler(requestData.error, connection);
			}

			// handle state
			if (requestData.action == "changeState") {
				$("#state").text(requestData.state);
			}

			// handle when inicialize player
			if (requestData.action == "initPlayer") {
				$("#player-username").text(requestData.data.username);
				$("#player-level").text(requestData.data.level);
				$("#player-life").text(requestData.data.life);
				$("#player-maxLife").text(requestData.data.maxLife);
			}

			// handle when inicialize opponent
			if (requestData.action == "initOpponent") {
				$("#opponent-username").text(requestData.data.username);
				$("#opponent-level").text(requestData.data.level);
				$("#opponent-life").text(requestData.data.life);
				$("#opponent-maxLife").text(requestData.data.maxLife);
			}

			// handle when you are winner
			if (requestData.action == "winner") {
				if (requestData.data.type == 1) {
					$("#state").text("Vyhráli jste hru - spoluhráč se odpojil.");
				}
				if (requestData.data.type == 2) {
					$("#state").text("Vyhráli jste hru!");
				}
			}

		};

		// interval for checking connection stability
		stabilityInterval = setInterval(function() {
			if (connection.readyState !== 1) {
				errorHandler("Spojení se serverem bylo přerušeno.", connection);
			}
		}, 5000);


	} catch (e) {
		errorHandler("Vyskytla se neočekávaná chyba.");
	}


});