/**
 * Repository
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
	},
	github: function(req, res) {
		var github = require('octonode');
		var client = github.client('03c8b23dd8aa9f0f5db35ff6ac694af3bed99de4');
		var ghorg;
		var ghrepo;
	
		if (req.param('id')) {
			Project.findOneByGithub_id(req.param('id'), function(err, project) {
				if (err || !project) return res.send(404);
				ghrepo = client.repo(project.github_repo_name);
				ghrepo.info(function(err, info) {
					if (err) res.send(err, 400);
					res.json(info)
				})
			})
		} else {
			ghorg = client.org('Fragment');
			ghorg.repos(function(err, repos) {
				if (err) res.send(err, 400);
				res.json(repos);
			})
		}
	},
	findOne: function(github_id, recursive, cb) {
		var github = require('octonode');
		var client = github.client('03c8b23dd8aa9f0f5db35ff6ac694af3bed99de4');
		var recursive = recursive ? -1 : recursive;
		if (github_id) {
			Project.findOneByGithub_id(github_id, function(err, project) {
				if (err) return cb(err);
				ghrepo = client.repo(project.github_repo_name);
				ghrepo.info(function(err, info) {
					if (err) return cb(err);
					if (!info) return cb();
					if (recursive <= 0) return cb(null, info);
					ghrepo.branches(function(err, branches) {
						if (err) return cb(err);
						info.Branch = branches
						cb(null, info);
					})
				})
			})
		} else {
			res.send(400);
		}
	},
	find: function(criteria, recursive, cb) {
		var github = require('octonode');
		var client = github.client('03c8b23dd8aa9f0f5db35ff6ac694af3bed99de4');
		var recursive = typeof recursive === 'undefined' ? -1 : recursive;
		ghorg = client.org('Fragment');
		ghorg.repos(function(err, repos) {
			if (err) return cb(err);
			if (!repos) return cb();
			cb(null, repos);
		})
	}
};
