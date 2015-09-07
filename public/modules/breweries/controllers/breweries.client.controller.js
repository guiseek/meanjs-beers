'use strict';

// Breweries controller
angular.module('breweries').controller('BreweriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Breweries', 'Beers',
	function($scope, $stateParams, $location, Authentication, Breweries, Beers) {
		$scope.authentication = Authentication;

		// Create new Brewery
		$scope.create = function() {
			// Create new Brewery object
			var brewery = new Breweries ({
				name: this.name
			});

			// Redirect after save
			brewery.$save(function(response) {
				$location.path('breweries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Brewery
		$scope.remove = function(brewery) {
			if (confirm('Tem certeza?')) {
				if ( brewery ) { 
					brewery.$remove();

					for (var i in $scope.breweries) {
						if ($scope.breweries [i] === brewery) {
							$scope.breweries.splice(i, 1);
						}
					}
				} else {
					$scope.brewery.$remove(function() {
						$location.path('breweries');
					});
				}
			}
		};

		// Update existing Brewery
		$scope.update = function() {
			var brewery = $scope.brewery;

			brewery.$update(function() {
				$location.path('breweries/' + brewery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Breweries
		$scope.find = function() {
			$scope.breweries = Breweries.query();
		};

		// Find existing Brewery
		$scope.findOne = function() {
			$scope.brewery = Breweries.get({ 
				breweryId: $stateParams.breweryId
			});
		};
	}
]);