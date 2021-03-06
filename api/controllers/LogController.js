module.exports = {
	_config: {},
	feed: function(req, res) {

		var Hash = require('hashjs');

		// subscribe req socket to create events on this model
		Log.subscribe(req.socket);

		var params = req.params.all();
		var options = {
			where: {
				closed: false
			}
		};

		// if sort param is given
		if (params.sort) {
			options.sort = {};
			options.sort[params.sort] = Number(params.direction) || 1;
		}

		if (params.type) {
			options.where.type = params.type;
		}

		if (params['Site.name']) {
			options.where['Site.name'] = params['Site.name'];
		}

		if (params.closed !== 'undefined') {
			options.where.closed = false;
		} else {
			options.where.closed = Boolean(params.closed);
		}

		Log
		.find()
		.where(options.where)
		.sort(options.sort || {updatedAt: -1})
		.limit(params.limit || 25)
		.skip(params.skip || 0)
		.exec(function(err, logs) {
			if (err) return res.json(err);

			// subscribe req socket to updates on the found models
			Log.subscribe(req.socket, logs);

			// find all users to populate assignee select input
			User.findList(function(err, users) {

				Log.native(function(err, coll) {
					if (err) return res.send(500, err);
					// get sites list for left-nav
					coll.distinct('Site.name', function(err, sites) {
						if (err) return res.send(500, err);
						// get list of types to filter streams
						coll.distinct('type', {closed: false}, function(err, types) {
							if (req.wantsJSON) {
								res.json(logs);
							} else {
								res.view({logs: logs, users: users, types: types, sites: sites});
							}
						});
					});
				});
			});
		});
	},
	add: function(req, res) {
		Log.createOrAppendChild(req, res, function(err, model) {
			if (err) return console.log(err);
			res.json(model);
		});
	},
	update: function(req, res) {
		Log.updateWithEvent(req.param('id'), req.body, req.session.user, function(err, log) {
			if (err || !log) {
				console.log(err);
				return res.send(404);
			}
			res.json(log);
		});
	}
};
