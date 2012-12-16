/**
 * Object represent player.
 * @author Vít Ledvinka | frosty22
 */
var Player = function(config, messenger, row) {
	this.messenger = messenger;

	this.id = row.id;
	this.username = row.username;
	this.level = row.level;

	this.maxLife = config.life;
	this.life = config.life;
};

Player.prototype = {


}

module.exports = Player;