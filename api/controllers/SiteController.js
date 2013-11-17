module.exports = {
	_config: {},
	overview: function(req, res) {
		Site.find({active: true}).sort({updatedAt: -1}).exec(function(err, sites) {
			if (err) return sails.log.error(err);
			Site.subscribe(req.socket, sites);
			res.view({sites: sites})
		})
	},
	find: function(req, res) {
		if (req.param('id')) {
			Site.findOne(req.param('id'), function(err, site) {
				if (err || !site) return res.send(500);
				Site.subscribe(req.socket, site);
				var recent = new Date();
				recent.setDate( (recent.getDate() - 14) );
				Log.find().where({site_id: site.id, createdAt: { '>': recent.toJSON()}}).exec(function(err, logs) {
					if (err) sails.log.error(err);
					site.Log = logs;
					res.json(site);
				});
			})
		} else {
			Site.find({}, function(err, sites) {
				if (err) return res.send(500);
				Site.subscribe(req.socket, sites);
				res.json(sites);
			});
		}
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
