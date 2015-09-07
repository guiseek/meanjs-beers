'use strict';

(function() {
	// Breweries Controller Spec
	describe('Breweries Controller Tests', function() {
		// Initialize global variables
		var BreweriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Breweries controller.
			BreweriesController = $controller('BreweriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Brewery object fetched from XHR', inject(function(Breweries) {
			// Create sample Brewery using the Breweries service
			var sampleBrewery = new Breweries({
				name: 'New Brewery'
			});

			// Create a sample Breweries array that includes the new Brewery
			var sampleBreweries = [sampleBrewery];

			// Set GET response
			$httpBackend.expectGET('breweries').respond(sampleBreweries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.breweries).toEqualData(sampleBreweries);
		}));

		it('$scope.findOne() should create an array with one Brewery object fetched from XHR using a breweryId URL parameter', inject(function(Breweries) {
			// Define a sample Brewery object
			var sampleBrewery = new Breweries({
				name: 'New Brewery'
			});

			// Set the URL parameter
			$stateParams.breweryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/breweries\/([0-9a-fA-F]{24})$/).respond(sampleBrewery);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.brewery).toEqualData(sampleBrewery);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Breweries) {
			// Create a sample Brewery object
			var sampleBreweryPostData = new Breweries({
				name: 'New Brewery'
			});

			// Create a sample Brewery response
			var sampleBreweryResponse = new Breweries({
				_id: '525cf20451979dea2c000001',
				name: 'New Brewery'
			});

			// Fixture mock form input values
			scope.name = 'New Brewery';

			// Set POST response
			$httpBackend.expectPOST('breweries', sampleBreweryPostData).respond(sampleBreweryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Brewery was created
			expect($location.path()).toBe('/breweries/' + sampleBreweryResponse._id);
		}));

		it('$scope.update() should update a valid Brewery', inject(function(Breweries) {
			// Define a sample Brewery put data
			var sampleBreweryPutData = new Breweries({
				_id: '525cf20451979dea2c000001',
				name: 'New Brewery'
			});

			// Mock Brewery in scope
			scope.brewery = sampleBreweryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/breweries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/breweries/' + sampleBreweryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid breweryId and remove the Brewery from the scope', inject(function(Breweries) {
			// Create new Brewery object
			var sampleBrewery = new Breweries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Breweries array and include the Brewery
			scope.breweries = [sampleBrewery];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/breweries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBrewery);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.breweries.length).toBe(0);
		}));
	});
}());