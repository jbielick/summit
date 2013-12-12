define([
	'backbone',
	'backbone-relational',
	'models/site'
],
function(Backbone, none) {

	'use strict';

	var LogModel = Backbone.RelationalModel.extend({
		initialize: function(ops) {},
		relations: [{
			relatedModel: function() { return require('models/site');},
			key: 'Site',
			type: 'HasOne'
		}],
		urlRoot: '/logs'
	});

	return LogModel;
});
