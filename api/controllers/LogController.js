module.exports = {
	_config: {},
	feed: function(req, res) {

		// subscribe req socket to create events on this model
		Log.subscribe(req.socket);

		var params = req.params.all();
		var options = {};

		// if sort param is given
		if (params.sort) {
			options.sort = {};
			options.sort[params.sort] = Number(params.direction) || 1;
		}

		// if url param 'closed' is set, use it to filter
		if (options.closed) {
			options.where = {closed: Boolean(options.closed)};
		}

		Log
		.find()
		.where(options.where || {closed: false})
		.sort(options.sort || {updatedAt: -1})
		.exec(function(err, logs) {
			if (err) return res.json(err);

			// subscribe req socket to updates on the found models
			Log.subscribe(req.socket, logs);

			// find some users to populate assignee menus
			User.find().exec(function(err, users) {
				if (err) return res.send(500, err);

				// finally, render the view
				res.view({logs: logs, users: users});
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
