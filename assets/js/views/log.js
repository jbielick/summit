define([
	'jquery',
	'underscore',
	'backbone',
	'backbone-relational',
	'backbone-binding'
],
function($, _, Backbone) {

	'use strict';

	var LogView = Backbone.View.extend({
		initialize: function(options) {
			if (options && options.model && options.model instanceof Backbone.RelationalModel) {
				this.template = options.template;
				this.model = options.model;
				this.model.view = this;
				this.model.bindView(this);
			}
		},
		events: {
			'click [data-behavior="dismiss"]'		: 'dismiss',
			'click [data-behavior="project/open"]'	: 'openProject',
			'click [data-toggle="notes"]'			: 'openNotes',
			'keyup [name="notes"]'					: 'saveNotes',
			'blur [name="notes"]'					: 'unlock'
		},
		unlock: function(e) {
			this.lockBinding = false;
		},
		saveNotes: function(e) {
			var self = this;
			clearTimeout(this.keyup);
			this.keyup = setTimeout(function() {
				self.model.save();
			}, 300);
		},
		openNotes: function(e) {
			var self = this, text;
			$(e.target).text(function() {
				if (this.innerHTML === 'Add Notes' || this.innerHTML === 'Open Notes') {
					text = 'Close Notes';
				} else {
					text = self.model.get('notes') ? 'Open Notes' : 'Add Notes';
				}
				return text;
			});
			this.$('.notes').attr('hidden', function() {
				if ($(this).attr('hidden')) {
					self.lockBinding = true;
					return false;
				} else {
					self.lockBinding = false;
					return true;
				}
			});
		},
		open: function(e) {
			
		},
		dismiss: function(e) {
			this.model.save({closed: true}, {wait: true});
			this.remove();
			return false;
		},
		render: function(options) {
			if (this.lockBinding) {
				return this;
			}
			this.el.innerHTML = this.template(this.model.toJSON());
			if (options && options.animate == false) {
				this.$('.slide-up').removeClass('slide-up');
			}
			return this;
		}
	});

	return LogView;
});