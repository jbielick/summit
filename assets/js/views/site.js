define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational'
],
function($, _, Backbone) {

	'use strict';

	var SiteView = Backbone.View.extend({
		attributes: {
			'class': 'modal fade none'
		},
		initialize: function(options) {
			if (options && options.model && options.model instanceof Backbone.RelationalModel) {
				this.template = options.template;
				this.model = options.model;
				this.model.view = this;
			}
		},
		events: {
			'click [data-dismiss]': function(e) {
			}
		},
		render: function(options) {
			var _this = this;
			this.model.fetch({
				success: function() {
					_this.el.innerHTML = _this.template(_this.model.toJSON());
				}
			})
			return this;
		}
	});

	return SiteView;
});