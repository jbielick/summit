module.exports = function(req, res, next) {
	if (req.session.user) {
		sails.config.views.layout = 'layouts/internal';
	}
	req.session.user = true;
	return next();
};
