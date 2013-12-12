define([
	'jquery',
	'underscore',
	'backbone'
],
function($, _, Backbone) {

	'use strict';

	var Modal = Backbone.Model.extend({
		defaults: {title: '', body: '', cancel: 'Cancel', action: 'Continue'}
	});

	return Modal;
});