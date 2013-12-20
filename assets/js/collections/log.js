define([
	'backbone',
	'models/log',
	'views/log',
	'text!/js/templates/log.js',
	'views/feedui'
],
function(Backbone, LogModel, LogView, LogTemplate, FeedUIView) {

	'use strict';

	var LogCollection = Backbone.Collection.extend({
		initialize: function(options) {

			var _this = this;

			if (options && options.$el) {
				this.$el = options.$el;
			}

			this.temp = {$el: $('<div/>')};

			this.on('add', function(model, collection, options) {
				var operation;
				if (options.merge) {
					operation = 'appendTo';
				} else if (options.merge) {
					operation = 'prependTo';
				} else {
					operation = 'prependTo';
				}
				$(new LogView({
						el: _.template(LogTemplate, model.toJSON(), {variable: 'Log'}), 
						model: model
					}).el)[operation](_this.$el);
			});
			this.on('remove', function(model, collection) {
				model.view.remove();
			});
			this.on('reset', function(collection, model) {
				_this.build();
				new FeedUIView({feed: _this});
			});
		},
		build: function() {
			var _this = this;
			_this.temp.$el.empty();
			_.each(_this.models, function(model) {
				new LogView({el: $.parseHTML(_.template(LogTemplate, model.toJSON(), {variable: 'Log'})), model: model}).$el.appendTo(_this.temp.$el)
			});
			if (_this.$el) {
				_this.$el.append(this.temp.$el);
			}
		},
		model: LogModel,
		url: '/feed'
	});

	return LogCollection;
});
