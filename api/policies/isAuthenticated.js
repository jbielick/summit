module.exports = function(req, res, next) {
	if (req.session.user) {
		return next();
	}
<<<<<<< HEAD
	req.session.flash = 'Please login to continue.';
=======
>>>>>>> dev
	return res.redirect('/login');
};
