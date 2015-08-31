var _ = require('underscore');
var HASHTAGS = require('./hashtags');

var UTILS = {
	validHashTags: function(tweet) {
		/*Array of hashtags*/
		var hashTags = tweet.entities.hashtags;
		if (hashTags.length) {
			var validTags = _.map(hashTags, function(hashTag) {
				var tagText = hashTag.text.toLowerCase();
				return _.find(HASHTAGS, function(control) {
					return _.contains(control.validTags, tagText);
				});
			});
			/*Additional step incase we get undefined*/
			return _.filter(validTags, function(tag) {
				return (tag) ? true : false;
			});
		}
	},
	lcdPrint: function(lcd, line1, line2) {
		lcd.clear().print(line1);
		lcd.cursor(1, 0);
		lcd.print(line2);
		return;
	},
	motorControl: function(board, m1, m2, control) {
		var forwardReverseTimeout = 5000;
		switch (control.control) {
			case 'forward':
				m1.fwd(255);
				m2.rev(255);
				m1.on("forward", function() {
					board.wait(forwardReverseTimeout, function() {
						m1.stop();
					});
				});
				m2.on("reverse", function() {
					board.wait(forwardReverseTimeout, function() {
						m2.stop();
					});
				});
				break;
			case 'reverse':
				m1.rev(255);
				m2.fwd(255);
				m1.on("reverse", function() {
					board.wait(forwardReverseTimeout, function() {
						m1.stop();
					});
				});
				m2.on("forward", function() {
					board.wait(forwardReverseTimeout, function() {
						m2.stop();
					});
				});
				break;
			case 'left':
				m1.fwd(125);
				m2.fwd(125);
				console.log(control.text);
				board.wait(1000, function() {
					m1.stop();
					m2.stop();
				});
				break;
			case 'right':
				m1.rev(125);
				m2.rev(125);
				console.log(control.text);
				board.wait(1000, function() {
					m1.stop();
					m2.stop();
				});
				break;
		}
	}
};

module.exports = UTILS;