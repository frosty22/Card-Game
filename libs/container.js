/**
 * Simple container for access parameters and services.
 * @author Vít Ledvinka | frosty22
 */
var Container = function(parameters) {
	if (parameters)
		this.parameters = parameters;
	else
		this.parameters = { };

	this.services = { };
}

Container.prototype = {

	/**
	 * Set parameter
	 * @param {string} name
	 * @param {mixed} value
	 * @return {Container}
	 */
	setParam: function(name, value) {
		this.parameters[name] = value;
		return this;
	},

	/**
	 * Get parameter
	 * @param {string} name
	 * @return {mixed}
	 */
	getParam: function(name) {
		return this.parameters[name];
	},

	/**
	 * Add service
	 * @param {string} name
	 * @param {Object} service
	 * @return {Container}
	 */
	addService: function(name, service) {
		this.services[name] = service;
		return this;
	},

	/**
	 * Get service
	 * @param {string} name
	 * @return {Object}
	 */
	getService: function(name) {
		if (this.services[name])
			return this.services[name];
		throw new Error("Service " + name + " doesnt exist.");
	},

	/**
	 * Has service
	 * @param {string} name
	 * @return {Boolean}
	 */
	hasService: function(name) {
		return this.services[name] != undefined;
	}

}

module.exports = Container;