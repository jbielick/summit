module.exports = {
	schema: true,
	attributes: {
		Site: 'object',
		host: 'string',
		uri: 'string',
		data: 'string',
		severity: 'string',
		closed: {
			type: 'boolean',
			defaultsTo: false
		},
		child_count: {
			type: 'integer',
			defaultsTo: 0
		},
		hash: 'string'
	},
	createOrAppendChild: function(req, res, next) {
		var crypto = require('crypto');
		if (req.body.data) {
			var hash = crypto.createHash('md5').update(req.body.data).digest('hex');
			Log.findOne({hash: hash, site: req.body.site}, function(err, log) {
				if (err) return console.log(err);
				if (!log) {
					// Create Log Record
					req.body.hash = hash;
					Site.findOne({id: req.body.site_id}, function(err, site) {
						if (err) return console.log(err);
						if (site) {
							req.body.Site = site;
						}
						Log.create(req.body).done(function(err, model) {
							if (err) return console.log(err);
							res.status(201);
							Log.publishCreate(model.toJSON());
							next(null, model.toJSON());
						});
					})
				} else {
					if (!log.child_count) {
						log.child_count = 1;
					} else {
						log.child_count++;
					}
					log.closed = false;
					log.save(function(err) {
						if (err) return console.log(err);
						res.status(200);
						Log.publishUpdate(log.id, log.toJSON());
						next(null, log.toJSON());
					})
				}
			})
		} else {
			res.send(400);
		}
	}
};
