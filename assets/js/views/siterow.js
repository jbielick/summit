define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational'
],
function($, _, Backbone) {

	'use strict';

	var SiteRowView = Backbone.View.extend({
		tagName: 'tr',
		initialize: function(options) {
			if (options.model) {
				this.model = options.model;
			}
			if (options.template) {
				this.template = options.template;
				this.render();
			}
			this.listenTo(this.model, 'change', function() {
				this.render();
			});
		},
		render: function() {
			var statuses = _.map(this.model.get('status'), function(v, k) {
				var s = Math.floor(v.code/100), y;
				if (s == 2) {
					y = 0;
				} else if (s == 5 || s == 0) {
					y = 30;
				} else {
					y = 30/1.8;
				}
				if (k == 0) {
					return 'M'+(k+50)+','+y;
				} else {
					return 'L'+(k+50)+','+y;
				}
			});
			this.el.innerHTML = this.template(this.model.toJSON());
			var graph = new Raphael(this.$('.status-graph').get(0), 250, 50);
			graph.path('M50,0L50,50L250,50').attr({fill: 'none', 'stroke-width': 1});
			graph.path(statuses.join()).attr({fill: 'none', "stroke-width": 1, "stroke-linecap": "round", stroke: '#007009'});
			graph.text(50, 10, 'OK -').attr({'text-anchor': 'end'});
			graph.text(50, 25, 'WARN -').attr({'text-anchor': 'end', color: 'yellow'});
			graph.text(50, 40, 'ERR -').attr({'text-anchor': 'end', color: 'red'});
		}
	});

	return SiteRowView;
});