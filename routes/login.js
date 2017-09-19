var express = require('express');
var router = express.Router();
var fs = require('fs');
var userlist = require('../public/data/getpic')


router.get('/', function (req, res, next) {
  console.log('user');
  res.render('login');
});


router.post('/', function(req, res, next) {  
  var _user = new User(req.body.data);
  User.findOne({username: _user.username}, function (err, user_a) {
    if (err) res.json(err.status|| 500, {"errorMsg":err.message});
      user_a.comparePwd(_user.password,function(err_b,isMatch){
        if(err) res.json(err_b.message||500, {"errorMsg":err_b.message})
        else if(isMatch){
          req.session.user_session= user_a;
          res.json({"data":{"usernamename":user_a.username,"_id":user_a._id}})
        }
        else  res.json(500, {"errorMsg": "用户名或密码错误"})
      })

  })
});


module.exports = router;
