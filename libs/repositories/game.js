/**
 * Game repository.
 * @author Vít Ledvinka | frosty22
 */
var GameRepository = function(connection) {
	this.connection = connection;
}

GameRepository.prototype = {

	/**
	 * Get game by hash
	 * @param {string} hash
	 * @param {Function} callback(Object result)
	 */
	getGameByHash: function(hash, callback) {
		this.connection.query("SELECT * FROM game WHERE hash = ?", [ hash ], function(err, result) {
			callback(result ? result[0] : null);
		});
	},

	/**
	 * Set first user to game
	 * @param {number} gameId
	 * @param {number} userId
	 */
	setFirstUserToGame: function(gameId, userId) {
		this.connection.query("UPDATE game SET user1 = ? WHERE id = ?", [ userId, gameId ]);
	},

	/**
	 * Set second user to game
	 * @param {number} gameId
	 * @param {number} userId
	 */
	setSecondUserToGame: function(gameId, userId) {
		this.connection.query("UPDATE game SET user2 = ? WHERE id = ?", [ userId, gameId ]);
	},

	/**
	 * Set game as started
	 * @param {number} gameId
	 */
	setStartedGame: function(gameId) {
		this.connection.query("UPDATE game SET started = NOW(), state = 1 WHERE id = ?", [ gameId ]);
	},

	setEndedGame: function(gameId, winnerId, experiences) {
		this.connection.query("UPDATE game SET ended = NOW(), state = 2, winner = ?, experiences = ? WHERE id = ?", [ winnerId, experiences, gameId ]);
	}

}

module.exports = GameRepository;
