var Const = require('../sharedConstants').constant;

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.birds = function(req, res){
  res.render('birds', { title: 'Birds.js', wsAddress: Const.SOCKET_ADDR + ':' + Const.SOCKET_PORT });
};