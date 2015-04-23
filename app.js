require('sails').lift(null, function(err, sails) {

	sails.LIVE_SITE = false;

	var Scout = require('./scout')
	var scout = new Scout(60);
	try {
		scout.start();
	} catch(e) {
		sails.log.error(e.message);
	}


});
