'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Brewery = mongoose.model('Brewery'),
	_ = require('lodash');

/**
 * Create a Brewery
 */
exports.create = function(req, res) {
	var brewery = new Brewery(req.body);
	brewery.user = req.user;

	brewery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(brewery);
		}
	});
};

/**
 * Show the current Brewery
 */
exports.read = function(req, res) {
	res.jsonp(req.brewery);
};

/**
 * Update a Brewery
 */
exports.update = function(req, res) {
	var brewery = req.brewery ;

	brewery = _.extend(brewery , req.body);

	brewery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(brewery);
		}
	});
};

/**
 * Delete an Brewery
 */
exports.delete = function(req, res) {
	var brewery = req.brewery ;

	brewery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(brewery);
		}
	});
};

/**
 * List of Breweries
 */
exports.list = function(req, res) { 
	Brewery.find().sort('-created').populate('user', 'displayName').exec(function(err, breweries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(breweries);
		}
	});
};

/**
 * Brewery middleware
 */
exports.breweryByID = function(req, res, next, id) { 
	Brewery.findById(id).populate('user', 'displayName').exec(function(err, brewery) {
		if (err) return next(err);
		if (! brewery) return next(new Error('Failed to load Brewery ' + id));
		req.brewery = brewery ;
		next();
	});
};

/**
 * Brewery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.brewery.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
