var express = require('express');
var router = express.Router();
var User = require("..public/data/users");  

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/', function(req, res, next) {  
  var _user= new User(req.body.data);
  User.find({username: _user.username},function (err,usr) {
    if(err) return res.json(500, {"errorMsg": err.message});
    else if(usr.length){
      res.json(500, {"errorMsg": "重复用户名"})
    }
    else{
      _user.save(function (err_b, user_b) {
        if (err_b)  res.json(500, {"errorMsg": err_b.message});
        else{
          delete user_b.password;
          res.json({"user": user_b})
        }
      })
    }
  })
});

module.exports = router;
