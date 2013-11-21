/**===================================
 *  Models
 ===================================*/
'use strict';

var App = {
	Auth: {},
	Model: {},
	Collection: {},
	View: {}
};

_.templateSettings = {
	interpolate: /\<\?=([\s\S]+?)\?\>/mg,
	escape: /\<\?-([\s\S]+?)\?\>/mg,
	evaluate: /\<\?([\s\S]+?)\?\>/mg
};

App.Model.Repo = Backbone.RelationalModel.extend({
	url: function() {
		return '/repositories/'+this.get('id')
	}
})

App.Model.Project = Backbone.RelationalModel.extend({
	url: function() {
		return '/projects/basecamp/'+this.get('id')
	}
})

App.Model.Site = Backbone.RelationalModel.extend({
	initialize: function(ops) {},
	relations: [{
		type: 'HasOne',
		relatedModel: 'App.Model.Repo',
		key: 'Repo'
	},{
		type: 'HasOne',
		relatedModel: 'App.Model.Project',
		key: 'Project'
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
		relatedModel: 'App.Model.Site',
		key: 'Site',
		type: 'HasOne'
	}],
	urlRoot: '/logs'
});