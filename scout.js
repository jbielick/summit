  // Find all sites with urls, set interval to loop over all, make http request to them
// and unshift the result to the top of the array of status codes for that site in the DB.
// if a site returns greater than a 200 response, we check if the response before that one was also not equal to
// 200 and if so, send an alert email. Sites responding with a > 200 statusCode only once will not throw an alert.
// Servers that don't respond get logged as statusCode 0, which is
//
// while we're unshifting items, we shift any status array with over 100 subdocuments until its length is === 100

var SCOUT_FROM_EMAIL = 'no-reply@example.com';
var SCOUT_NOTIFY_EMAIL = '';

var Scout = (function() {

  function Scout(period) {
    this.period = period * 1000;
    this.http = require('http');
    this.alerts = {};
    this.https = require('https');
    this.nodemailer = require("nodemailer");
  }

  Scout.prototype.start = function() {
    var _this = this;
    this.interval = setInterval(function ScoutServers() {
      Site.native(function(err, collection) {
        collection.find({
          url: {'$exists': true, '$ne': ''},
          protocol: {'$exists': true, '$ne': ''}
        }).toArray(function(err, sites) {
            _.each(sites, function ScoutSite(site) {
              var requester = site.protocol === 'https://' ? _this.https : _this.http;
              var requestOptions = {
                rejectUnauthorized: false,
                hostname: site.url,
                agent: false
              };
              var req = requester.get(requestOptions, function(res) {
                _this.processResponse(site, res);
              });
              req.on('error', function(e) {
                console.log(new Date().toLocaleString()+' '+site.url+' ====Scout Error===');
                console.log(e);
              })
            });
        });
      });
    }, this.period);
  };

  Scout.prototype.processResponse = function(site, res, e) {

    var _this = this,
      sendmail,
      html,
      mailOptions;

    if (
      site.status
      && site.status.length > 1
      && Math.floor( res.statusCode / 100 ) !== 2
      && Math.floor( (site.status[0].code + site.status[1].code) / 100 ) !== 4
    ) {
      if (!_this.alerts[site._id]) {
        sendmail = _this.nodemailer.createTransport('Sendmail');
        html = '<b>Server Status Alert: </b><br><hr><br>Last three status codes for '+site.name+' were '+
            '<b>'+_this.http.STATUS_CODES[res.statusCode]+'</b>, <b>'+_this.http.STATUS_CODES[res.statusCode]+'</b>, and <b>'+_this.http.STATUS_CODES[res.statusCode]+'</b>';
        mailOptions = {
          from: 'Summit <' + SCOUT_FROM_EMAIL + '>',
          to: SCOUT_NOTIFY_EMAIL,
          subject: 'Server Status Alert',
          html: html
        };

        sendmail.sendMail(mailOptions, function(error, response){
          _this.alerts[site._id] = true;
          console.log(error, response);
        });
      } else {
        //pass over, an alert has already been sent.
      }
    } else {
      _this.alerts[site._id] = false;
    }

    site.status.push({
      code: res.statusCode || 0,
      createdAt: new Date().toJSON()
    });

    //TODO see note below.
    while (site.status.length > 200) {
      site.status.shift();
    }

    Site.update({id: site._id}, {status: site.status}, function(err, sites) {
      if (err) console.log(err);
      Site.publishUpdate(sites[0].id, sites[0].toJSON());
      // TODO yeah, you probably shouldn't socket.io publishUpdate 17K subdocuments every 10 seconds
      // limit the pubsub to most recent and only push into arrays. /sites/overview
    });
  }
  return Scout;
})();

module.exports = Scout;