function index(req,res,next){
  res.render('index');
}



module.exports = function(app,io){
  app.get('/',index);
  app.get('/index',index);
};
