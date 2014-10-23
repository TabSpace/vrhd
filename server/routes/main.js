function index(req,res,next){
  res.render('index');
}

function sight(req,res,next){
  res.render('sight');
}

function scene(req,res,next){
  res.render('scene');
}

module.exports = function(app,io){
  app.get('/',index);
  app.get('/index',index);
  app.get('/sight',sight);
  app.get('/scene',scene);
};

