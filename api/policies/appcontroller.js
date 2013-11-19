module.exports = function(req, res, next) {
	if (req.session.user) {
		sails.config.views.layout = 'layouts/internal';
	}
	return next();
};
