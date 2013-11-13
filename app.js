require('sails').lift(null, function(err, sails) {
	sails.LIVE_SITE = false;

	sails.Form = (function() {
		
		function Form() {
			this.validationErrors = {};
		}
		
		Form.prototype.create = function(model, data, options) {
			this.model = sails.models[model.toLowerCase()];
			this.data = data || {};
			var defaults = {
				action: '',
				id: model+'',
				'class': 'form-horizontal',
				inputDefaults: {
					'class': 'form-control',
					div: 'form-group',
					label: true
				}
			};
			var options = _.extend(defaults, options);
			this.inputDefaults = _.extend({}, this.inputDefaults, options.inputDefaults || {});
			delete options.inputDefaults;
			options.close = false;
			if (data.id) {
				options.html = this.hidden('id', {value: data.id});
			}
			return this._tag('form', options);
		};
		
		Form.prototype.input = function(field, options) {
			var options = _.extend({}, this.inputDefaults, options || {});
			var tokens = field.split('.');
			var attrs = this.model ? this.model.attributes : {};
			var fieldname = field.replace('^([a-zA-Z])(\.)', '$1\[').replace('\.', '][');
			fieldname += tokens.length > 1 ? ']' : '';
			var type, label, div, tag;
			
			if (!options.type && attrs) {
				if (typeof attrs[tokens[tokens.length - 1]] === 'string') {
					options.type = attrs[tokens[tokens.length - 1]];
				} else {
					options.type = attrs[tokens[tokens.length - 1]].type;
				}
			} else {
				options.type = 'string';
			}
			options.field = field;
			tag = this._getInput({name: fieldname, options: options});
			if (options.label) {
				tag = this.label(field)+tag;
			}
			return options.div ? this._wrap(tag) : tag;
		};
		
		Form.prototype._getInput = function(args) {
			switch(args.options.type) {
				case 'hidden': return this.hidden(args.name, args.options); break;
				case 'string': return this.text(args.name, args.options); break;
				case 'integer': return this.number(args.name, args.options); break;
				case 'boolean': return this.checkbox(args.name, args.options); break;
				case 'select': return this.select(args.name, args.options.options, _.extend(args.options, {selected: args.selected})); break;
				default: return this.text(args.name, args.options); break;
			}
		};
		
		Form.prototype.text = function(name, options) {
			var options =  _.extend(options, {name: name, type: 'text', open: true});
			if (options.field && this.data[options.field]) {
				options.value = this.data[options.field];
			}
			return this._tag('input', options);
		};
		
		Form.prototype.number = function(name, options) {
			return this._tag('input', _.extend(options, {name: name, type: 'number', close: false}));
		};
		
		Form.prototype.checkbox = function(name, options) {
			
		};
		
		Form.prototype.textarea = function(name, options) {
			return this._tag('textarea', _.extend(options, {name: name}));
		};
		
		Form.prototype.select = function(name, options) {
			
		};
		
		Form.prototype.file = function(name, options) {
			return this._tag('input', _.extend(options, {name: name, type: 'file', close: false}));
		};
		
		Form.prototype.radio = function(name, options) {
			
		};
		
		Form.prototype.hidden = function(name, options) {
			return this._tag('input', {name: name, type: 'hidden', value: options.value, close: false});
		};
		
		Form.prototype._tag = function(tag, options) {
			options = options || {};
			var open = '<'+tag+this._parseAttributes(options, ['close', 'field', 'open', 'contents', 'html', 'div', 'label'])+'>';
			var contents = options.html || '';
			var close = '</'+tag+'>';
			if (options.open || options.close === false) {
				return open+contents;
			} else if (options.close || options.open === false) {
				return contents+close;
			} else {
				return open+contents+close;
			}
		};
		
		Form.prototype.label = function(field, id) {
			var tokens = field.split('.');
			var field = tokens[tokens.length - 1];
			var label = field[0].toUpperCase()+field.substr(1);
			return this._tag('label', {'for': id, html: label});
		};
		
		Form.prototype.end = function(submitLabel) {
			var button = this._wrap(this._tag('button', {'class': 'btn btn-primary', type: 'submit', html: submitLabel}));
			var contents;
			delete this.inputDefaults;
			delete this.model;
			return submitLabel ? this._tag('form', {html: button, close: true}) : this._tag('form', {close: true});
		};
		
		Form.prototype._wrap = function(tag) {
			var attributes = {
				'class': this.inputDefaults.div
			}
			return this._tag('div', _.extend(attributes, {html: tag}));
		};
		
		Form.prototype._parseAttributes = function(attributes, excludes) {
			var output = '', value;
			excludes = excludes || [];
			
			_.each(attributes, function(val, attr) {
				if (val && excludes.indexOf(attr) === -1) {
					value = Array.isArray(val) ? val.join(' ') : val;
					value = value.replace(/"/g, '\\"');
					output += ' '+attr+'="'+value+'"';
				}
			})
			return output;
		};
		return new Form();
	})();
	
	// ping them sites and save the statuscode.
	var http = require('http');
	var https = require('https');
	var statusHistory = {};
	var url, requester;

	// Find all sites with urls, set interval to loop over all, make http request to them
	// and unshift the result to the top of the array of status codes for that site in the DB.
	// if a site returns greater than a 200 response, we check if the response before that one was also not equal to 
	// 200 and if so, send an alert email. Sites responding with a > 200 statusCode only once will not throw an alert.
	//
	// while we're unshifting items, we pop any status array over 100 subdocuments

	var ping = setInterval(function pingServers() {
		Site.native(function(err, collection) {
			collection.find({
				url: {'$exists': true, '$ne': ''}, 
				protocol: {'$exists': true, '$ne': ''}
			}).toArray(function(err, sites) {
					console.log('pinging');
					_.each(sites, function pingSite(site) {
						var status = {};
						requester = site.protocol === 'https://' ? https : http;
						requester.get(site.protocol+site.url, processResponse.bind(undefined, site)).on('error', function(e) {
							processResponse(site, {statusCode: 0});
							console.log(new Date().toLocaleString()+' '+site.url+' ====Ping Error===');
							console.log(e);
						})
					});
			});
		});
	}, 10000) // every n seconds
	function processResponse(site, res) {
		var status = {};
		if ((res.statusCode/100).toFixed(0) > 2 && site.status && site.status.length && (site.status[0].code/100).toFixed(0) > 2 ) {
			var nodemailer = require("nodemailer");
			var sendmail = nodemailer.createTransport('sendmail');
			var mailOptions = {
			    from: "Summit <no-reply@summit.fragmentlabs.com>",
			    to: "josh@fragmentlabs.com",
			    subject: "Server Status Alert",
			    html: "<b>Server Status Alert: </b><br><hr><br>Server status for "+this.name+" was <b>"+res.statusCode+"</b>"
			};
			if (sails.LIVE_SITE) {
				sendmail.sendMail(mailOptions, function(error, response){
					console.log(error, response);
				});
			}
		}
		status.code = res.statusCode;
		status.updatedAt = new Date().getTime();
		site.status.unshift(status);
		if (site.status.length > 100) {
			site.status.pop();
		}
		Site.update({id: site._id}, {status: site.status}, function(err, site) {if (err) console.log(err)});
	}
});
