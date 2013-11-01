_.extend(Backbone.Model.prototype, {
	bindView: function(view, options) {
		var _this = this
		this.view = view
		
		// listen for model changes
		_this.on('change', function(model) {
			var changedFlat = H.flatten(_this.beforeRender(model.changedAttributes()))
			_this._inject.call(model, changedFlat, this.view)
		})
		
		// listen for user input
		view.events = _.extend(view.events || {}, {
			'click *[type="submit"]': function(e) {
				e.preventDefault()
				if (this.save) {
					this.save(e)
				} else {
					this.model.save.call(this.model)
				}
			},
			'input *[name]': function(e) {
				_this._set(e, this);
			},
			'change *[name]': function(e) {
				_this._set(e, this);
			},
			'paste *[name]': function(e) {
				_this._set(e, this);
			}
		})
		
		return _this
	},
	_set: function(e, view) {
		var tokens = H._tokenize(e.target.getAttribute('name')), val = $(e.target).val(), ob
		if (tokens[0] === this.alias) {
			tokens.shift()
		}
		view.model.set(tokens[0], val, {silent: true})
		view.model.trigger('input')
	},
	_inject: function(changed, view) {
		var $view = view.$el || $(view.el)
		_.each(changed, function(v, k) {
			var $binded = view.$('[name="'+k+'"]')
			if ($binded.is('input, textarea, select')) {
				$binded.val(v)
			} else {
				$binded.text(v)
			}
		})
	},
	beforeRender: function(changed) {
		return changed
	}
})
