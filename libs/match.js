/**
 * Object represent match between two players.
 * @author Vít Ledvinka | frosty22
 */
var Match = function(config, id) {
	this.id = id;
	this.levelMultiply = config.levelMultiply;
};

Match.prototype = {

	started: false,
	ended: false,
	player1: null,
	player2: null,
	connectedPlayer: null,
	experiences: 0,

	addPlayer: function(player) {
		if (this.isStarted()) throw new Error("Match is already started.");

		if (!this.player1) this.player1 = player;
		else
			if (!this.player2) this.player2 = player;
			else throw new Error("Hra již je plná.");
	},

	setConnectedPlayer: function(player) {
		this.connectedPlayer = player;
	},

	getConnectedPlayer: function() {
		return this.connectedPlayer;
	},

	getOpponentPlayer: function() {
		if (this.player1 == this.connectedPlayer) return this.player2;
		else return this.player1;
	},

	getStartError: function() {
		if (!this.player1 || !this.player2)
			return "Spoluhráč se již odpojil.";
		return null;
	},

	isStarted: function() {
		return this.started ? true : false;
	},

	start: function() {
		if (this.isStarted()) throw new Error("Match is already started.");

		var diff = Math.abs(this.player1.level - this.player2.level) * this.levelMultiply;
		if (diff) {
			if (this.player1.level > this.player2.level) {
				this.player2.life += diff;
				this.player2.maxLife = this.player2.life;
			} else {
				this.player1.life += diff;
				this.player1.maxLife = this.player1.life;
			}
		}
		this.started = new Date();
		this.experiences = 10; // TODO: Dodělat odhad zkušeností
	},

	end: function() {
		this.ended = new Date();
	},

	isEnded: function() {
		return this.ended ? true : false;
	}

}

module.exports = Match;