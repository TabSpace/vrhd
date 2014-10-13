module.exports = function(app) {
  var routes = ['./main'];
  routes.forEach(function(route) {
    require(route)(app);
  });
};
