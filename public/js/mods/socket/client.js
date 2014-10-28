/**
 * @author xiaojue
 * @description scoket init
 */
define('mods/socket/client', function(require, exports, module) {

  var server = function() {
    this.iourl = window.location.host;
  };

  server.prototype = {
    constructor: server,
    init: function(model) {
      var self = this;
      this.vrhd = io(this.iourl);
      this.set(model);
    },
    set: function(model) {
      this.vrhd.emit('set',model); 
    },
    on:function(type,fn){
      this.vrhd.on(type,fn); 
    }
  };

  module.exports = new server();
});

