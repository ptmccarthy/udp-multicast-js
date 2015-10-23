var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var PORT = 4000;

server.bind( function() {
  server.setBroadcast(true)
  server.setMulticastTTL(128);
  setInterval(sendMessage, 2000);
});

var sendMessage = function() {
  var message = new Buffer('multicast test message');
  server.send(message, 0, message.length, PORT, "239.1.1.1");
  console.log("Sent " + message + " to the wire...");
}
