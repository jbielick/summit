module.exports = {
	schema: true,
	attributes: {
		site_id: 'string',
		site: 'string',
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
		var bcrypt = require('bcrypt');
		bcrypt.hash(req.body.data, null, function(err, hash) {
			Log.findOne({hash: hash, site: req.body.site}, function(err, log) {
				if (err) return console.log(err);
				if (!log) {
					// Create Log Record
					req.body.hash = hash;
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
		})
	}
};
