var udp = require('./udp-stream');

var stream = udp({
  address   : '0.0.0.0',
  multicast : '239.1.1.1',
  port      : 4000,
  reuseAddr : true,
  loopback  : true
});

process.stdin.pipe(stream);
