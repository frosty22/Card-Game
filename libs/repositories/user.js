/**
 * User repository.
 * @author Vít Ledvinka | frosty22
 */
var UserRepository = function(connection) {
	this.connection = connection;
}

UserRepository.prototype = {

	/**
	 * Get user by id.
	 * @param {number} id
	 * @param {Function} callback(Object result)
	 */
	getUserById: function(id, callback) {
		this.connection.query("SELECT * FROM user WHERE id = ?", [ id ], function(err, result) {
			callback(result ? result[0] : null);
		});
	},

	/**
	 * Get user by hash.
	 * @param {string} hash
	 * @param {Function} callback(Object result)
	 */
	getUserByHash: function(hash, callback) {
		this.connection.query("SELECT * FROM user WHERE hash = ?", [ hash ], function(err, result) {
			callback(result ? result[0] : null);
		});
	}

}

module.exports = UserRepository;