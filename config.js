/**
 * Global configuration file.
 * @type {Object}
 */
module.exports = {

	/**
	 * Array of allowed origins
	 */
	allowedOrigins: [ "http://localhost", "http://192.168.1.10" ],

	/**
	 * Database connection setting
	 */
	database: {
			host     : 'localhost',
			user     : 'root',
			password : '',
			database : 'test'
	},

	/**
	 * Base setting of player
	 */
	player: {
		life	: 100
	},

	/**
	 * Base setting of match
	 */
	match: {
		levelMultiply:	10
	}

}
