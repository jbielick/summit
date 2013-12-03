/*=====================================
 *  Views
 *=====================================*/
 
App.View.Log = Backbone.View.extend({
	attributes: {
		'class': 'panel panel-danger slide-up log'
	},
	initialize: function(options) {
		if (options && options.model && options.model instanceof Backbone.RelationalModel) {
			this.template = options.template;
			this.model = options.model;
			this.model.view = this;
		}
	},
	events: {
		'click [data-behavior="dismiss"]': 'dismiss',
		'click [data-behavior="project/open"]': 'openProject'
	},
	openProject: function(e) {
		// this.model.get('site_id')
		// .fetch();
		// var v = new App.View.Project({model: this.model.get('Site'), template: _.template($('#ProjectViewTemplate').html(), null, {variable: 'Site'})});
		// if (!v.model.get('Repo')) {
			// v.model.set('Repo', new App.Model.Github.Repo({id: v.model.get('github_id')}));
			// v.model.set('Basecamp', new App.Model.Basecamp.Project({id: v.model.get('basecamp_id')}));
		// }
		// v.model.get('Repo').fetch({
// 			success: function() {
// 				v.model.get('Basecamp').fetch({
// 					success: function() {
// 						$(v.render().el).css('display', 'none').appendTo(document.body).modal()
// 					}
// 				})
// 			}
// 		})
	},
	dismiss: function(e) {
		this.model.save({closed: true}, {wait: true});
		this.$el.fadeOut(400, function() {
			this.remove();
		}).slideUp(400);
		return false;
	},
	render: function(options) {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	}
})

App.View.Site = Backbone.View.extend({
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

App.View.SiteRow = Backbone.View.extend({
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