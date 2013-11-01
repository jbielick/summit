module.exports = function(req, res, next) {
	sails.config.views.layout = 'layouts/internal';
	req.session.user = true;
	return next();
};
