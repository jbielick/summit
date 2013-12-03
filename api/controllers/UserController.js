/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	login: function (req, res) {
		if (req.method === 'POST' && req.body.email && req.body.password) {
			var bcrypt = require('bcrypt');
			User.findOneByEmail(req.body.email).done(function (err, user) {
				if (err) return res.send(500);
				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, match) {
						if (err) return res.send(500);
						if (match) {
							req.session.user = user.toJSON();
							return res.redirect( req.session.loginRedirect || '/feed' )
						} else {
							req.session.flash = 'Incorrect login';
							return res.view();
						}
					});
				} else {
					req.session.flash = 'Incorrect login';
					return res.view();
				}
			});
		} else {
			return res.view();
		}
	},
	logout: function(req, res) {
		delete req.session.user;
		req.session.flash = 'Goodbye';
		res.redirect('/');
	},
	_config: {}
};
