var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var PORT = 4000;

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    client.addMembership('239.1.1.1');
});

client.on('message', function (message, remote) {   
  console.log('From: ' + remote.address + ':' + remote.port +' - ' + message);
});

client.bind(PORT);