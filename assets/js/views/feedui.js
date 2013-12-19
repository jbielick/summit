define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational',
	'models/feedui'
],
function($, _, Backbone, no, FeedUIModel) {

	'use strict';

	var FeedUI = Backbone.View.extend({
		initialize: function(options) {
			var _this = this;
			this.feed = options.feed;
			this.setBottom();
			this.model = new FeedUIModel({skip: 0});
			$(window).on('scroll', function() {
				if ($(window).scrollTop() >= _this.bottom) {
					$(this).trigger('hit');
				}
			});
		},
		setBottom: function() {
			var bottom = $('.feed-content').height() - $(window).height(),
				_this = this;

			this.bottom = bottom < 0 ? 0 : bottom;

			$(window).one('hit', function() {
				var skip = _this.model.get('skip') + 25;
				_this.model.set('skip', skip);
				_this.feed.url = '/logs?limit=25&skip='+skip;
				_this.feed.fetch({
					remove: false,
					success: function() {
						_this.setBottom();
					}
				});
			});

			return this.bottom;
		}
	});

	return FeedUI;
});