/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
		first_name: 'string',
		last_name: 'string',
		full_name: function() {
			return this.first_name+' '+this.last_name;
		},
		email: {
			type: 'email',
			required: true
		},
		basecamp_id: 'integer',
		password: 'string',
		toJSON: function() {
			var data = this.toObject();
			delete data.password;
			return data;
		}
	},
	beforeCreate: function(attrs, next) {
		var bcrypt = require('bcrypt');
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(attrs.password, salt, function(err, hash) {
				if (err) return next(err);
				attrs.password = hash;
				next();
			});
		});
	},
	beforeUpdate: function(attrs, next) {
		var bcrypt = require('bcrypt');
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(attrs.password, salt, function(err, hash) {
				if (err) return next(err);
				attrs.password = hash;
				next();
			});
		});
	}
};
