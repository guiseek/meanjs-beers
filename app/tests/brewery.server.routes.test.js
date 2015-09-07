'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Brewery = mongoose.model('Brewery'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, brewery;

/**
 * Brewery routes tests
 */
describe('Brewery CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Brewery
		user.save(function() {
			brewery = {
				name: 'Brewery Name'
			};

			done();
		});
	});

	it('should be able to save Brewery instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Brewery
				agent.post('/breweries')
					.send(brewery)
					.expect(200)
					.end(function(brewerySaveErr, brewerySaveRes) {
						// Handle Brewery save error
						if (brewerySaveErr) done(brewerySaveErr);

						// Get a list of Breweries
						agent.get('/breweries')
							.end(function(breweriesGetErr, breweriesGetRes) {
								// Handle Brewery save error
								if (breweriesGetErr) done(breweriesGetErr);

								// Get Breweries list
								var breweries = breweriesGetRes.body;

								// Set assertions
								(breweries[0].user._id).should.equal(userId);
								(breweries[0].name).should.match('Brewery Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Brewery instance if not logged in', function(done) {
		agent.post('/breweries')
			.send(brewery)
			.expect(401)
			.end(function(brewerySaveErr, brewerySaveRes) {
				// Call the assertion callback
				done(brewerySaveErr);
			});
	});

	it('should not be able to save Brewery instance if no name is provided', function(done) {
		// Invalidate name field
		brewery.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Brewery
				agent.post('/breweries')
					.send(brewery)
					.expect(400)
					.end(function(brewerySaveErr, brewerySaveRes) {
						// Set message assertion
						(brewerySaveRes.body.message).should.match('Please fill Brewery name');
						
						// Handle Brewery save error
						done(brewerySaveErr);
					});
			});
	});

	it('should be able to update Brewery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Brewery
				agent.post('/breweries')
					.send(brewery)
					.expect(200)
					.end(function(brewerySaveErr, brewerySaveRes) {
						// Handle Brewery save error
						if (brewerySaveErr) done(brewerySaveErr);

						// Update Brewery name
						brewery.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Brewery
						agent.put('/breweries/' + brewerySaveRes.body._id)
							.send(brewery)
							.expect(200)
							.end(function(breweryUpdateErr, breweryUpdateRes) {
								// Handle Brewery update error
								if (breweryUpdateErr) done(breweryUpdateErr);

								// Set assertions
								(breweryUpdateRes.body._id).should.equal(brewerySaveRes.body._id);
								(breweryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Breweries if not signed in', function(done) {
		// Create new Brewery model instance
		var breweryObj = new Brewery(brewery);

		// Save the Brewery
		breweryObj.save(function() {
			// Request Breweries
			request(app).get('/breweries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Brewery if not signed in', function(done) {
		// Create new Brewery model instance
		var breweryObj = new Brewery(brewery);

		// Save the Brewery
		breweryObj.save(function() {
			request(app).get('/breweries/' + breweryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', brewery.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Brewery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Brewery
				agent.post('/breweries')
					.send(brewery)
					.expect(200)
					.end(function(brewerySaveErr, brewerySaveRes) {
						// Handle Brewery save error
						if (brewerySaveErr) done(brewerySaveErr);

						// Delete existing Brewery
						agent.delete('/breweries/' + brewerySaveRes.body._id)
							.send(brewery)
							.expect(200)
							.end(function(breweryDeleteErr, breweryDeleteRes) {
								// Handle Brewery error error
								if (breweryDeleteErr) done(breweryDeleteErr);

								// Set assertions
								(breweryDeleteRes.body._id).should.equal(brewerySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Brewery instance if not signed in', function(done) {
		// Set Brewery user 
		brewery.user = user;

		// Create new Brewery model instance
		var breweryObj = new Brewery(brewery);

		// Save the Brewery
		breweryObj.save(function() {
			// Try deleting Brewery
			request(app).delete('/breweries/' + breweryObj._id)
			.expect(401)
			.end(function(breweryDeleteErr, breweryDeleteRes) {
				// Set message assertion
				(breweryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Brewery error error
				done(breweryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Brewery.remove().exec();
		done();
	});
});