'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var breweries = require('../../app/controllers/breweries.server.controller');

	// Breweries Routes
	app.route('/breweries')
		.get(breweries.list)
		.post(users.requiresLogin, breweries.create);

	app.route('/breweries/:breweryId')
		.get(breweries.read)
		.put(users.requiresLogin, breweries.hasAuthorization, breweries.update)
		.delete(users.requiresLogin, breweries.hasAuthorization, breweries.delete);

	// Finish by binding the Brewery middleware
	app.param('breweryId', breweries.breweryByID);
};
