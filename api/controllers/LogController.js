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
		
		Log.subscribe(req.socket);
		
		var query = Log.find()
		
		if (req.param('status') !== 'all') {
			query.where({closed: false})
		}
		
		query
		.sort({updatedAt: 1})
		.exec(function(err, logs) {
			if (err) return res.view('404')
			Log.subscribe(req.socket, logs);
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
	add: function(req, res) {
		Log.createOrAppendChild(req, res, function(err, model) {
			if (err) return console.log(err);
			res.json(model);
		});
	},
	update: function(req, res) {
		req.body.user_id = req.session.user.id;
		Log.update({id: req.param('id')}, req.body, function(err, logs) {
			if (err) return res.send(500, err);
			if (!logs.length) return res.view('404');
			Log.publishUpdate(logs[0].id, logs[0].toJSON());
			res.json(logs[0]);
		})
	}
};


// TODO : strong argument for using github id for associations. 
// A site's errors should always be associated with a codebase, not a project/client existing in basecamp.