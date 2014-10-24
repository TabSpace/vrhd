function index(req,res,next){
  res.render('index');
}

function sight(req,res,next){
  res.render('sight');
}

function vision(req,res,next){
  res.render('vision');
}

module.exports = function(app,io){
  app.get('/',index);
  app.get('/index',index);
  app.get('/sight',sight);
  app.get('/vision',vision);
};

