module.exports = {
	schema: true,
	attributes: {
		Site: 'json',
		User: {
			type: 'json',
			defaultsTo: {}
		},
		events: {
			type: 'array',
			defaultsTo: []
		},
		host: 'string',
		uri: 'string',
		data: 'string',
		severity: 'string',
		site_id: 'string',
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
					Site.findOne(req.body.site_id).done(function(err, site) {
						if (err) return console.log(err);
						if (site) {
							delete site.status;
							req.body.Site = site.toJSON();
							
							Log.create(req.body).done(function(err, model) {
								if (err) return console.log(err);
								res.status(201);
								Log.publishCreate(model.toJSON());
								next(null, model.toJSON());
							});
						} else {
							console.log(new Date().toJSON()+': Bad Request: Site Not Found for '+JSON.stringify(req.body));
							res.send(400);
						}
					});
				} else {
					if (!log.child_count) {
						log.child_count = 1;
					} else {
						log.child_count++;
					}
					log.closed = false;
					log.save(function(err) {
						if (err) {
							console.log(err);
							return res.send(500);
						}
						res.status(200);
						Log.publishUpdate(log.id, log.toJSON());
						next(null, log.toJSON());
					})
				}
			})
		} else {
			res.send(400);
		}
	},
	updateWithEvent: function(id, attrs, user, next) {
		Log.update(id, attrs).exec(function(err, logs) {
			if (err || logs.length == 0) { 
				console.log(err);
				return next(err);
			}
			var log = logs[0];
			
			if (!log.events) {
				log.events = [];
			}

			log.events.push(
				Log.createEvent('edited', user)
			);
			
			log.save(function(err) {
				Log.publishUpdate(id, log.toJSON());
				next(null, log);
			});
			
		});
	},
	createEvent: function(action, user, previous) {
		return {
			User: user,
			action: action,
			updatedAt: new Date().toJSON()
		};
	}
};
