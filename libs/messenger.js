/**
 * Messenger is wrapper surround WS connection for simple use.
 * @author Vít Ledvinka | frosty22
 */
var Messenger = function(connection) {
	this.connection = connection;
}

Messenger.prototype = {

	/**
	 * Send message to client
	 * @param {string} action
	 * @param {Object} object
	 */
	send: function(action, object) {
		this.connection.sendUTF(JSON.stringify({ action : action, data : object }));
	},

	/**
	 * Send error message
	 * @param {string} message
	 */
	sendState: function(message) {
		this.connection.sendUTF(JSON.stringify({ action: "changeState", state : message }));
	},

	/**
	 * Send error message
	 * @param {string} message
	 */
	sendError: function(message) {
		this.connection.sendUTF(JSON.stringify({ "error" : message }));
	}

}

module.exports = Messenger;