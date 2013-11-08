require('sails').lift(null, function(err, sails) {
	
	// ping them sites and save the statuscode.
	var http = require('http');
	var https = require('https');

	var ping = setInterval(function() {	
		sails.models.site.find(function(err, sites) {
			_.each(sites, function(site) {
				if (site.url && site.protocol) {
					(site.protocol === 'https://' ? https : http).get((site.protocol || 'http://')+site.url, function(res) {
						site.status = res.statusCode;
						site.save();
					}).on('error', function(e) {
						//TODO don't let it break here
						console.log('PING ERROR ======================================================');
						console.log(e)
					})
				}
			})
		})
	}, 20000) // every 20 seconds
});