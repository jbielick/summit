/*=====================================
 *  Collections
 *=====================================*/

App.Collection.Site = Backbone.Collection.extend({
	model: App.Model.Site
});

App.Collection.Project = Backbone.Collection.extend({
	model: App.Model.Project,
	url: '/projects'
});

App.Collection.Log = Backbone.Collection.extend({
	model: App.Model.Log,
	url: '/logs'
});
