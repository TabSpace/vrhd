var os=require('os');

var globalModel;

module.exports = function(app, io) {

  io.on('connection', function(socket) {
    socket.on('set', function(data) {
      if(data) globalModel = data;
      if(globalModel) io.emit('update', globalModel);
    });
  });

  function index(req, res, next) {
	  var ifaces=os.networkInterfaces();
	  var ips = [], qrUrls = [];
	  for (var dev in ifaces) {

		  var alias=0;
		  ifaces[dev].forEach(function(details){
			  if (details.family=='IPv4' && (0 === details.address.indexOf('10')) ) {
				  ips.push(details.address);
//				  console.log(dev+(alias?':'+alias:''), details.address);
				  ++alias;
			  }
		  });
	  }
	  ips.forEach(function(ip){
		  qrUrls.push('http://qr.liantu.com/api.php?text='+ encodeURIComponent('http://'+ip+':'+app.get('port')+'/sight'));
	  })
    res.render('index', {qrUrls:qrUrls});
  }

  function sight(req, res, next) {
    res.render('sight');
  }

  function vision(req, res, next) {
    res.render('vision');
  }

  function touch(req, res, next) {
    res.render('touch');
  }

  app.get('/', index);
  app.get('/index', index);
  app.get('/sight', sight);
  app.get('/vision', vision);
  app.get('/touch', touch);
};

