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
			Log.find().where({site_id: site.id, createdAt: { '>': recent.toJSON()}}).exec(function(err, logs) {
				if (err) return res.send(400);
				site.Log = logs;
				res.json(site);
			})
		})
	},
	update: function(req, res) {
		if (req.method.toLowerCase() === 'post') {
			Site.update({id: req.body.id}, req.body, function(err, sites) {
				if (err) return console.log(err);
				req.session.flash = 'The site was saved successfully';
				req.body = sites[0];
				res.view();
			});
		} else {
			Site.findOne(req.param('id'), function(err, site) {
				if (err || !site) throw err;
				console.log(site);
				// Project.findOne({basecamp_id: site.basecamp_id}, function(err, project) {
				// 	if (err) throw err;
				// 	if (project) {
				// 		site.Project = project;
				// 	}
				// 	req.body = site;
				// 	res.view();
				// })
			})
		}
	}
};
