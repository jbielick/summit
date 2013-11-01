module.exports = {
	index: function(req, res) {
		var https = require('https');
		var body = '';
		var options = {
		  host: 'basecamp.com',
		  path: '/1759232/api/v1/projects.json',
		  auth: 'basecamp@fragmentlabs.com:dGhyZWV2ZTM1',
		  // path: '/1759232/api/v1/projects/18862/todolists.json',
		  headers: {
			  'user-agent': 'Fragment Summit (josh@fragmentlabs.com)'
		  }
		};
		var request = https.request(options, function(response) {
			response.on('data', function (chunk) {
				body += chunk;
			});
			response.on('end', function () {
				res.send(body, 200);
				// res.view({projects: JSON.parse(body)});
			});
		});
		request.on('error', function(err) {
			res.send(err.toString(), 404);
		});
		request.end();
	},
	view: function(req, res) {
		res.send(200)
	},
  _config: {}
};
