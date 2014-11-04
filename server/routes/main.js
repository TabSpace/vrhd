var globalModel;

module.exports = function(app, io) {

  io.on('connection', function(socket) {
    socket.on('set', function(data) {
      if(data) globalModel = data;
      if(globalModel) io.emit('update', globalModel);
    });
  });

  function index(req, res, next) {
    res.render('index');
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

