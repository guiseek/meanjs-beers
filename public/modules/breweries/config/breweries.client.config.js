'use strict';

// Configuring the Articles module
angular.module('breweries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Breweries', 'breweries', 'dropdown', '/breweries(/create)?');
		Menus.addSubMenuItem('topbar', 'breweries', 'List Breweries', 'breweries');
		Menus.addSubMenuItem('topbar', 'breweries', 'New Brewery', 'breweries/create');
	}
]);