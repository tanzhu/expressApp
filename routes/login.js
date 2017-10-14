var express = require('express');
var router = express.Router();

var Users = require('../modules/users');

router.get('/', function (req, res, next) {
  if(req.param('action') === 'logout'){
    delete req.session.loginUser;
    delete res.locals.loginUser;
  }
  
  // if(req.param.action)
  res.render('login', {err:""});
});

router.post('/', function(req, res, next) {  
  var username = req.body.username;
  var password = req.body.password;

  let response = res;
  Users.findOne({ 'username':username, 'password':password}, function(err, result, res){
    if(err) return console.log(err)
    if(result){
      req.session.loginUser = {'username':result.username};
      response.redirect('index');
    }
    else {
      response.render('login', {err:"用户名或密码不正确"});
    }
  });

  // var db = req.db;
  // var collection = db.get('users');
  // collection.find({"username":username,"password":password},function(e,docs){
  //     console.log(docs);
  //     if(docs.length > 0){
  //       var loginUser = docs[0];
  //       delete loginUser.password;
  //       req.session.loginUser = loginUser;
  //       res.redirect('index');
  //     }
  //     else {
  //       res.render('login', {err:"用户名或密码不正确"});
  //     }
  // });

});


module.exports = router;
