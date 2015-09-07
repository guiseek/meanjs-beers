'use strict';

//Setting up route
angular.module('breweries').config(['$stateProvider',
	function($stateProvider) {
		// Breweries state routing
		$stateProvider.
		state('listBreweries', {
			url: '/breweries',
			templateUrl: 'modules/breweries/views/list-breweries.client.view.html'
		}).
		state('createBrewery', {
			url: '/breweries/create',
			templateUrl: 'modules/breweries/views/create-brewery.client.view.html'
		}).
		state('viewBrewery', {
			url: '/breweries/:breweryId',
			templateUrl: 'modules/breweries/views/view-brewery.client.view.html'
		}).
		state('editBrewery', {
			url: '/breweries/:breweryId/edit',
			templateUrl: 'modules/breweries/views/edit-brewery.client.view.html'
		});
	}
]);