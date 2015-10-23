var udp  = require('dgram');
var pipe = require('stream').prototype.pipe;

var udpStream = function(options, cb) {
  var options = options || {};

  // parse options param or resort to default values
  var address     = options.address   || '0.0.0.0';
  var port        = options.port      || 12345;
  var unicast     = options.unicast   || null;
  var broadcast   = options.broadcast || null;
  var multicast   = options.multicast || null;
  var ttl         = options.ttl       || 10;
  var loopback    = options.loopback  || false;
  var reuseAddr   = (options.reuseAddr === false) ? false : true;
  var destination = unicast || multicast || broadcast;

  var socket = udp.createSocket({
      type: 'udp4',
      reuseAddr: reuseAddr
  });

  var startupErrorHandler = function(err) {
    console.log('Error opening socket: ' + err);
    return cb && cb(err);
  }

  socket.write = function(message) {
    if (typeof message === 'string') {
      message = new Buffer(message, 'utf8');
    }

    socket.send(message, 0, message.length, port, multicast)
  };

  socket.end = function() {
    setImmediate(function() {
      socket.close();
    });
  };

  socket.on('error', startupErrorHandler);

  socket.bind();

  socket.on('listening', function() {
    console.log('Listening on ' + port);
    socket.removeListener('error', startupErrorHandler);

    if (multicast) {
      try {
        socket.addMembership(multicast);
        socket.setMulticastTTL(ttl);
        socket.setMulticastLoopback(loopback ? true : false);
      }
      catch (err) {
        socket.emit('error', err);

        return cb && cb(err);
      }
    } else if (broadcast) {
      socket.setBroadcast(true);
    }

    return cb && cb();
  });

  socket.pipe = pipe;

  return socket;
}

module.exports = udpStream;
