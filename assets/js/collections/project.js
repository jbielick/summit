define([
	'backbone',
	'models/project'
],
function(Backbone, ProjectModel) {

	'use strict';

	var ProjectCollection = Backbone.Collection.extend({
		model: ProjectModel,
		url: '/project'
	});

	return ProjectCollection;
});
