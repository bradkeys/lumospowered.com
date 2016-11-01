var authHeader = 'Basic ' + window.btoa('{{ game.id }}:{{ game.api_key }}');

// Set up AngularJS.
lumosModule
	.config(function($httpProvider) {
		// Set authorization header.
		$httpProvider.defaults.headers.common['Authorization'] = authHeader;
	})
	// Register custom filters.
	.filter('fromunixtime', function() {
		return unixTimeToRelative;
	})
	.filter('round', function() {
		return round;
	});