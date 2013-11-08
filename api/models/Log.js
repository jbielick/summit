module.exports = {
	attributes: {
		closed: {
			type: 'boolean',
			defaultsTo: false
		},
		child_count: {
			type: 'integer',
			defaultsTo: 0
		}
	},
	createOrAppendChild: function(req, res, next) {
		Log.findOne({data: req.body.data, site: req.body.site, uri: req.body.uri}, function(err, log) {
			if (err) return console.log(err);
			if (!log) {
				Log.create(req.body).done(function(err, model) {
					if (err) return console.log(err);
					res.status(201);
					Log.publishCreate(model.toJSON());
					next(null, model.toJSON());
				});
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
	}
};
