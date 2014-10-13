function index(req,res,next){
  res.render('index');
}



module.exports = function(app){
  app.get('/',index);
  app.get('/index',index);
};
