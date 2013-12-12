define([
	'jquery',
	'underscore',
	'backbone'
],
function($, _, Backbone) {

	'use strict';

	var Flash = Backbone.Model.extend({
		defaults: {message: ''}
	});

	return Flash;
});