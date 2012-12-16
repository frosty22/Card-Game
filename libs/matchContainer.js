/**
 * Object provides control of all matches.
 * @author Vít Ledvinka | frosty22
 */
var Match = require("./match.js");

/**
 * @param connection Connection
 * @constructor
 */
var MatchContainer = function(config, connection) {
	this.connection = connection;
	this.matchConfig = config;
};

MatchContainer.prototype = {

	/**
	 * List of matches
	 */
	matches: new Array(),

	/**
	 * Create new match
	 * @param {Object} gameRow
	 * @return Match
	 */
	create: function(gameRow) {
		this.matches[gameRow.id] = new Match(this.matchConfig, gameRow.id);
		return this.matches[gameRow.id];
	},

	/**
	 * Get match by index
	 * @param {number} index
	 * @return Match
	 */
	getByIndex: function(index) {
		return this.matches[index];
	},

	/**
	 * Remove match
	 * @param Match|integer
	 */
	remove: function(index) {
		if (typeof index === 'object') {
			index = index.id;
		}
		this.matches.splice(index, 1);
	}


}

module.exports = MatchContainer;