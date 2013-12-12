/*
 *  AppHelper Equivalent for the front-end code.
 *  
 *		Accessible via App.Helper global in views and templates.
 *
 */
define([
	'jquery',
	'underscore',
	'hash',
	'views/flash',
	'views/modal'
],
function($, _, hash, Flash, Modal) {

	'use strict';

	var Helper = function() {

		this.parseVideoVars = function(code) {
			var error = false,
				vidVars = {},
				vimeo_pattern = /[0-9]{8,9}/,
				yt_pattern1 = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
				yt_pattern2 = /([^#\&\?]*){11}/;

			if(vimeo_pattern.test(code)) {
				vidVars.code = code.match(vimeo_pattern)[0];
				vidVars.video_type_id = 1;
			} else if (yt_pattern1.test(code)) {
				vidVars.code = code.match(yt_pattern1[2]);
				vidVars.video_type_id = 2;
			} else if (yt_pattern2.test(code)) {
				vidVars.code = code.match(yt_pattern2)[0];
				vidVars.video_type_id = 2;
			} else {
				error = true;
			}

			if(!error)
				return vidVars;
			else
				return false;
		};

		// returns embed html string for vimeo or youtube iframe in the post view
		this.embedVideo = function(vidVars, options) {
			var embed;
			switch(vidVars.video_type_id)
			{
				case 1:
					embed = '<iframe src="//player.vimeo.com/video/'+vidVars.code+'?title=0&amp;byline=0&amp;portrait=0&amp;color=cbcf8c"'+
						'class="media-video" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
				break;
				case 2:
					embed = '<iframe class="media-video" src="//www.youtube.com/embed/'+vidVars.code+'?rel=0&wmode=transparent" frameborder="0" allowfullscreen></iframe>';
				break;
				default:
					embed = '<div class="alert ">There was an error adding your video.</div>';
				break;
			}
			return embed;
		}

		var flash = new Flash();
		this.Flash = flash.set.bind(flash);
		var modal = new Modal();
		this.Modal = modal.set.bind(modal);
	};

	return new Helper();
})