var server = require('./server');

server.start(function(server){
  console.info('Express for vrhd listening at http://0.0.0.0:%s',server.address().port);
});
