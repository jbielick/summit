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
		log_count: 'integer',
		sansStatus: function() {
			var data = this.toObject();
			delete data.status;
			return data;
		}
	},
	findList: function(where, cb) {
		Site.find(where || {}).exec(function(err, rawSites) {
			if (err) return cb(err);
			var sites = {};
			_.each(rawSites, function(v, k) {
				sites[v.id] = v.name;
			});
			cb(null, sites);
		});
	}
};
