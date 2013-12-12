define([
	'jquery',
	'underscore',
	'backbone',
	'Helper',
	'models/Flash'
],
function($, _, Backbone, Helper, FlashModel) {

	'use strict';

	var Flash = Backbone.View.extend({
		attributes: {
			id: 'flashMessage',
			'class': 'message'
		},
		initialize: function(options) {
			this.model = new FlashModel();
		},
		set: function(message) {
			if (message) {
				this.model.set('message', message);
			}
			this.render();
		},
		appended: false,
		render: function(message) {
			var _this = this;
			this.el.innerHTML = _.template('<span name="message"><%= message %></span>', this.model.toJSON());
			if (!this.appended) {
				this.appended = true;
				$(window.location.pathname.indexOf('admin') > -1 ? '.header + .container' : '.view').prepend(this.el);
			}
			clearTimeout(this.removeAfter);
			this.removeAfter = setTimeout(function() {
				_this.remove();
				_this.appended = false;
			}, 6000);
		}
	});

	return Flash;
});