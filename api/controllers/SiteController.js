module.exports = {
	_config: {},
	index: function(req, res) {
		Site.find({active: true}).sort({updatedAt: -1}).exec(function(err, sites) {
			if (err) return console.log(err);
			res.view({sites: sites})
		})
	},
	find: function(req, res) {
		Site.findOne(req.param('id'), function(err, site) {
			if (err || !site) return res.send(400);
			var recent = new Date();
			recent.setDate( (recent.getDate() - 14) );
			Log.find().where({project_id: project.id, createdAt: { '>': recent.toJSON()}}).exec(function(err, logs) {
				if (err) return res.send(400);
				site.Log = logs;
				res.json(site);
			})
		})
	},
	update: function(req, res) {
		Site.findOne(req.param('id'), function(err, site) {
			if (err) throw err;
			req.body = site;
			res.view();
		})
	}
};
