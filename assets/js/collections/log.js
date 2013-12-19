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
				if (options.add) {
					operation = 'prependTo';
				} else if (options.merge) {
					operation = 'appendTo';
				}
				$(new LogView({
						template: _.template(LogTemplate, null, {variable: 'Log'}), 
						model: model
					}).render().el)[operation](_this.$el);
			});
			this.on('remove', function(model, collection) {
				model.view.remove();
			});
			this.on('reset', function(collection, model) {
				_this.refresh();
				new FeedUIView({feed: _this});
			});
		},
		refresh: function() {
			var _this = this;
			_this.sort({silent: true});
			_this.temp.$el.empty();
			_.each(_this.models, function(model) {
				$(new LogView({template: _.template(LogTemplate, null, {variable: 'Log'}), model: model}).render().el).appendTo(_this.temp.$el)
			});
			if (_this.$el) {
				_this.$el.html(this.temp.$el.html());
			}
		},
		model: LogModel,
		url: '/logs',
		comparator: function(model) {
			return -(new Date(model.get('modifiedAt')).getTime());
		}
	});

	return LogCollection;
});
