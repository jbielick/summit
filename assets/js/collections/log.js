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

			this.on('add', function(model, collection) {
				$(new LogView({template: _.template(LogTemplate, null, {variable: 'Log'}), model: model}).render().el).prependTo(_this.$el);
			});
			this.on('remove', function(model, collection) {
				model.view.remove();
			});
			this.on('reset', function(collection, model) {
				_this.sort({silent: true});
				_this.temp.$el.empty();
				_.each(collection.models, function(model) {
					$(new LogView({template: _.template(LogTemplate, null, {variable: 'Log'}), model: model}).render().el).appendTo(_this.temp.$el)
				});
				if (_this.$el) {
					_this.$el.html(this.temp.$el.html());
				}
				new FeedUIView({feed: _this});
			});
		},
		model: LogModel,
		url: '/logs',
		comparator: function(model) {
			return -(new Date(model.get('modifiedAt')).getTime());
		}
	});

	return LogCollection;
});
