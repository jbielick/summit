define([
	'backbone',
	'models/site'
],
function(Backbone, SiteModel) {

	'use strict';

	var SiteCollection = Backbone.Collection.extend({
		model: SiteModel,
		url: '/sites'
	});

	return SiteCollection;
});
