var Twit = require('twit');
var twitterConfig = require('./twitter-config.json');
var five = require("johnny-five");
var board, lcd;


/**
 * Extract the first hashtag in the tweet converted to lowercase
 * @param  {String} tweetText 
 * @return {Boolean | String} Returns false when no hashtags are found
 */
var sanitizeTweet = function(tweetText) {
	var hashTagArray = tweetText.match(/(\#([A-Z]|[a-z]))\w+/g) || [];
	if (!hashTagArray.length) {
		return false;
	}
	var hashTag = hashTagArray[0].replace(/\#/, '').toLowerCase();
	return hashTag;
};

/**
 * Check if hashtag is a defined control
 * @param  {String} tweetText The tweeted text
 * @return {Object}
 */
var checkHashtag = function(tweetText) {
	var hashTag = sanitizeTweet(tweetText);
	var directions = {
		forward: {
			text: 'Moving forward!',
			command: function() {}
		},
		backward: {
			text: 'Moving backward!',
			command: function() {}
		},
		left: {
			text: 'Turning left!',
			command: function() {}
		},
		right: {
			text: 'Turning right!',
			command: function() {}
		},
		slightleft: {
			text: 'Adjusting left!',
			command: function() {}
		},
		slightright: {
			text: 'Adjusting right!',
			command: function() {}
		},
		noop: {
			text: 'Invalid command!'
		}
	};

	return (directions.hasOwnProperty(hashTag)) ? directions[hashTag] : directions.noop;
};

var T = new Twit(twitterConfig);

board = new five.Board();

board.on("ready", function() {

	lcd = new five.LCD({
		// LCD pin name  RS  EN  DB4 DB5 DB6 DB7
		// Arduino pin # 7    8   9   10  11  12
		pins: [7, 8, 9, 10, 11, 12],
		backlight: 6,
		rows: 2,
		cols: 16
			// Options:
			// bitMode: 4 or 8, defaults to 4
			// lines: number of lines, defaults to 2
			// dots: matrix dimensions, defaults to "5x8"
	});

	// Tell the LCD you will use these characters:
	lcd.useChar("bigpointerleft");
	lcd.useChar("bigpointerright");
	lcd.useChar("arrowne");
	lcd.useChar("arrownw");
	lcd.useChar("arrowsw");
	lcd.useChar("arrowse");

	var stream = T.stream('statuses/filter', {
		track: '@awaydaybot'
	});

	stream.on('tweet', function(tweet) {
		//To get the list of hashtags on an array format
		//console.log(JSON.stringify(tweet.entities.hashtags));
		lcd.clear().print('@' + tweet.user.screen_name);
		lcd.cursor(1, 0);
		lcd.print(checkHashtag(tweet.text).text);
		//lcd.print(':bigpointerleft::bigpointerright::arrowne::arrownw::arrowsw::arrowse:');
		//Feedback from the bot to user
		/*T.post('statuses/update', {
			status: '@' + tweet.user.screen_name + ' ' + checkHashtag(tweet.text).text
		}, function(err, data, response) {
			console.log(data);
		});*/
	});

	stream.on('disconnect', function(disconnectMessage) {
		lcd.clear().print('Stream disconnected!');
		lcd.cursor(1, 0);
		lcd.clear().print('Please reconnect!');
		console.log('Stream is disconnected!. Please reconnect!.');
	})

	stream.on('error', function(error) {
		lcd.clear().print('Stream Error!');
		console.log(error);
	});

	this.repl.inject({
		lcd: lcd
	});

});


//stream.stop() //Call this function on the stream to stop streaming (closes the connection with Twitter).
// stream.start() //Call this function to restart the stream after you called .stop() on it