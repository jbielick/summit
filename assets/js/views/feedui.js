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
			this.skip = 0;
			this.setBottom();
			this.model = new FeedUIModel();
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
				_this.skip += 25;
				_this.feed.url = '/logs?limit=25&skip='+_this.skip;
				_this.feed.fetch({remove: false});
			});

			return this.bottom;
		}
	});

	return FeedUI;
});