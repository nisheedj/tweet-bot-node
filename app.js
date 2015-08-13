var Twit = require('twit');
var twitterConfig = require('./twitter-config.json');

var T = new Twit(twitterConfig);

/**
 * Extract the first hashtag in the tweet converted to lowercase
 * @param  {String} tweetText 
 * @return {Boolean | String} Returns false when no hashtags are found
 */
var sanitizeTweet = function(tweetText){
  var hashTagArray = tweetText.match(/(\#([A-Z]|[a-z]))\w+/g) || [];
  if(!hashTagArray.length){
    return false;
  }
  var hashTag = hashTagArray[0].replace(/\#/,'').toLowerCase();
  return hashTag;
};

var stream = T.stream('statuses/filter', { track: '@awaydaybot' });

stream.on('tweet', function (tweet) {
  console.log(sanitizeTweet(tweet.text));
});

stream.on('disconnect', function (disconnectMessage) {
  console.log('Stream is disconnected!. Please reconnect!.');
})

stream.on('error', function (error) {
  console.log(error);
});

//stream.stop() //Call this function on the stream to stop streaming (closes the connection with Twitter).
// stream.start() //Call this function to restart the stream after you called .stop() on it
