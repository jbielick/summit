/**
 * LogController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	_config: {},
	open: function(req, res) {
		var query = Log.find()
		if (req.param('status') !== 'all') {
			query.where({closed: false})
		}
		
		query
		.sort('createdAt DESC')
		.exec(function(err, logs) {
			if (err) return res.send(400)
			_.each(logs, function(log) {
				if (log.project_id) {
					Project.findOne(log.project_id).done(function(err, project) {
						if (err) return null;
						log.Project = project
					})
				}
			})
			res.json(logs)
		})
	},
	update: function(req, res) {
		
	}
};


// TODO : strong argument for using github id for associations. 
// A site's errors should always be associated with a codebase, not a project/client existing in basecamp.