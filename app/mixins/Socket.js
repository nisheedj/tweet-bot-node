

var Socket = {
  componentDidMount: function() {
    socket.once('connect', function() {
      console.log('connected');
    });
    socket.once('disconnect', function() {
      
    });
  }
};

module.exports = Socket;