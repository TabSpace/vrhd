module.exports = function(app,io) {
  var routes = ['./main'];
  routes.forEach(function(route) {
    require(route)(app,io);
  });
};
