define([
	'backbone',
	'models/log'
],
function(Backbone, LogModel) {

	'use strict';

	var LogCollection = Backbone.Collection.extend({
		model: LogModel,
		url: '/logs'
	});

	return LogCollection;
});
