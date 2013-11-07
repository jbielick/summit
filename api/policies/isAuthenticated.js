module.exports = function(req, res, next) {
	if (req.session.user) {
		return next();
	}
	req.session.flash = 'Please login to continue.';
	return res.redirect('/login');
};
