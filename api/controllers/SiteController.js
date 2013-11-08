module.exports = {
	_config: {},
	index: function(req, res) {
		Site.find({active: true}).sort({updatedAt: -1}).exec(function(err, sites) {
			if (err) return console.log(err);
			res.view({sites: sites})
		})
	}
};
