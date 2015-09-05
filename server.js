var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);

/*Set static resources*/
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

/*Base index file*/
app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: __dirname
  });
});

server.listen(9000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://' + host + ':' + port);
});