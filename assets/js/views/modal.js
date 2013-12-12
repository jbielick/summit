define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'models/modal',
	'Helper',
	'text!/js/templates/modal.html'
],
function($, _, Backbone, none, ModalModel, Helper, modalTemplate) {

	'use strict';

	var Modal = Backbone.View.extend({
		attributes: {
			'class': 'modal fade'
		},
		events: {
			'click [data-behavior]' : 'delegate'
		},
		initialize: function() {
			this.model = new ModalModel();
		},
		set: function(content, cb) {
			if (_.isObject(content)) {
				this.model.set(content);
			} else {
				this.model.set(this.model.defaults);
				this.model.set('body', content);
			}
			return this.render(cb);
		},
		appended: false,
		render: function(cb) {
			var _this = this;
			this.el.innerHTML = _.template(modalTemplate, this.model.toJSON(), {variable: 'Content'});
			this.$el.on('shown.bs.modal', function() {return cb ? cb(_this.$el) : true;});
			if (!this.appended) {
				this.$el.modal();
			}
		}
	});

	return Modal;
});
