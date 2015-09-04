/**
 * This file contains the code to instantiate the Twitter stream
 */
var Twit = require('twit');
var _ = require('underscore');

var TWITTER = function(options) {

	var _this = this;

	var _defaults = {
		trackParam: '@awaydaybot',
		onTweet: function() {},
		onDisconnect: function() {},
		onError: function() {}
	};

	this.options = _.extend({}, _defaults, options);

	/*Check if the json file exists*/
	var _checkTwitConfig = function() {
		try {
			_this.options.twitConfig = require('../twitter-config.json');
		} catch (exception) {
			console.error('"twitter-config.json" missing!');
			process.exit(1);
		}
		return;
	};

	var _createTwitInstance = function() {
		_this.Twit = new Twit(_this.options.twitConfig);
		return;
	};

	var _createStreamInstance = function() {
		_this.TwitStream = _this.Twit.stream('statuses/filter', {
			track: _this.options.trackParam
		});

		_this.TwitStream.on('tweet', _this.options.onTweet);
		_this.TwitStream.on('disconnect', _this.options.onDisconnect);
		_this.TwitStream.on('error', _this.options.onError);
		return;
	};

	var _init = function() {
		_checkTwitConfig();
		_createTwitInstance();
		_createStreamInstance();
		return this;
	};

	_init();
};

module.exports = TWITTER;