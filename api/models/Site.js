/**
 * Site
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	attributes: {
		id: 'string',
		name: 'string',
		basecamp_id: 'integer',
		github_id: 'integer',
		github_repo_name: 'string',
		url: 'string',
		host: {
			type: 'string',
			defaultsTo: 'vm2.fragmentlabs.com'
		},
		protocol: {
			type: 'string',
			defaultsTo: 'http://'
		},
		active: {
			type: 'boolean',
			defaultsTo: false
		},
		status: 'array',
		log_count: 'integer'
	}
};
