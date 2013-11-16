module.exports = function(req, res, next) {
	if (req.session.user) {
		return next();
	}
	req.session.loginRedirect = req.url;
	return res.redirect('/login');
};
