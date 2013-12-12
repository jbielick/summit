define([
	'backbone',
	'Helper'
],
function(Backbone, AppHelper) {

	var Router = Backbone.Router.extend({
		routes: {
			'feed/help'		: 'help'
		},
		help: function() {
			AppHelper.Modal('Do you need help?');
		}
	});

	var AppRouter = new Router();

	Backbone.history.start({pushState: true});

	return AppRouter;
});