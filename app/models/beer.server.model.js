'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Beer Schema
 */
var BeerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Beer name',
		trim: true
	},
	style: {
		type: String,
		default: '',
		required: 'Please fill Beer style',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	brewery: {
		type: Schema.ObjectId,
		ref: 'Brewery'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Beer', BeerSchema);