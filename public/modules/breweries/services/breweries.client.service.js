'use strict';

//Breweries service used to communicate Breweries REST endpoints
angular.module('breweries').factory('Breweries', ['$resource',
	function($resource) {
		return $resource('breweries/:breweryId', {
			breweryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);