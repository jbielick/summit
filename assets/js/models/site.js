define([
	'backbone',
	'backbone-relational',
	'models/log'
],
function(Backbone, none, LogModel) {

	'use strict';

	var SiteModel = Backbone.RelationalModel.extend({
		initialize: function(ops) {},
		relations: [{
			type: 'HasMany',
			relatedModel: function() {return require('models/log')},
			key: 'Log',
			relatedCollection: function() {return require('collections/log')}
		}],
		urlRoot: '/sites'
	});

	return SiteModel;
});
