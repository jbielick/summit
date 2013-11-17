'use strict';

var App = {
	Model: {
		Basecamp: {},
		Github: {}
	},
	Collection: {},
	View: {}
};

_.templateSettings = {
	interpolate: /\<\?=([\s\S]+?)\?\>/mg,
	escape: /\<\?-([\s\S]+?)\?\>/mg,
	evaluate: /\<\?([\s\S]+?)\?\>/mg
};

App.Model.Github.Repo = Backbone.RelationalModel.extend({
	url: function() {
		return '/projects/github/'+this.get('id')
	}
})

App.Model.Basecamp.Project = Backbone.RelationalModel.extend({
	url: function() {
		return '/projects/basecamp/'+this.get('id')
	}
})

App.Model.Project = Backbone.RelationalModel.extend({
	initialize: function(ops) {},
	relations: [{
		type: 'HasOne',
		relatedModel: 'App.Model.Github.Repo',
		key: 'Repo'
	},{
		type: 'HasOne',
		relatedModel: 'App.Model.Basecamp.Project',
		key: 'Basecamp'
	},{
		type: 'HasMany',
		relatedModel: 'App.Model.Log',
		key: 'Log',
		relatedCollection: 'App.Collection.Log'
	}],
	urlRoot: '/projects'
})

App.Model.Log = Backbone.RelationalModel.extend({
	initialize: function(ops) {},
	relations: [{
		relatedModel: 'App.Model.Project',
		key: 'Project',
		type: 'HasOne'
	}],
	urlRoot: '/logs'
});

App.Model.Site = Backbone.Model.extend({
	urlRoot: '/sites'
});

/*=====================================
 *  Collections
 *=====================================*/

App.Collection.Project = Backbone.Collection.extend({
	model: App.Model.Project,
	url: '/projects'
})

App.Collection.Log = Backbone.Collection.extend({
	model: App.Model.Log,
	url: '/logs'
})


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
		this.model.get('Project').fetch()
		var v = new App.View.Project({model: this.model.get('Project'), template: _.template($('#ProjectViewTemplate').html(), null, {variable: 'Project'})});
		if (!v.model.get('Repo')) {
			v.model.set('Repo', new App.Model.Github.Repo({id: v.model.get('github_id')}));
			v.model.set('Basecamp', new App.Model.Basecamp.Project({id: v.model.get('basecamp_id')}));
		}
		v.model.get('Repo').fetch({
			success: function() {
				v.model.get('Basecamp').fetch({
					success: function() {
						$(v.render().el).css('display', 'none').appendTo(document.body).modal()
					}
				})
			}
		})
	},
	dismiss: function(e) {
		this.model.save({closed: true}, {wait: true});
		return false;
	},
	render: function(options) {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	}
})

App.View.Project = Backbone.View.extend({
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
})