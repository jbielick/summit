define([
	'views/Flash',
	'views/Modal',
	'Session',
	'Helper'
], function(Flash, Modal, Session, Helper) {

	// build and start the app object and its Router

	var flash = new Flash();
	var modal = new Modal();

	// make App.Helper a global so it's accessible in views/templates

	window.App = {
		Flash 		: flash.set.bind(flash),
		Modal 		: modal.set.bind(modal),
		Helper		: Helper
	};

	Backbone.history.start({pushState: true})

	return window.App;
});
