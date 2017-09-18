var express = require('express');
var router = express.Router();

var superagent = require('superagent');
var observe = require('observe.js');
var cheerio = require('cheerio');
var path = require('path');
var url = require('url');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('reptile');
});

router.post('/', function(req, res, next) {
  var fetchUrl = req.body.url;
  console.log(fetchUrl);

  //以同步的方式：判断是否存在这个文件夹，不存在才创建
  // if (!fs.existsSync('temp')) {
  //   fs.mkdirSync('temp');
  // }
  //获取当前路径，方便读写目录跟文件
  var cwd = process.cwd();

  var fetch = observe({});

  fetch.url = fetchUrl;
  fetch.query = "";

  fetch.on({
    url: function(url) {
      var that = this
      //get方法发出请求，query方法为url添加query字段（url问号背后的）
      //end方法接受回调参数，html一般在res.text中
      superagent
          .get(url)
          .query(this.query)
          .end(function(res) {
              if (res.ok) {
                  //赋值给reptile.text，就会触发回调
                  that.text = res.text
              }
          })
    },
    //触发的回调函数在这里
    text: function(text) {
        var that = this
        //cheerio 的 load 方法返回的对象，拥有与jQuery相似的API
        var $ = cheerio.load(text)
        var postList = []
        //根据html结构，筛选所需部分
        //这个页面我们只要标题跟对应的url
        $('h2.title a').each(function() {
                postList.push({
                    title: $(this).text(),
                    url: path.join(url.parse(that.url).hostname, $(this).attr('href'))
                })
            })
        //赋值就触发回调
        this.postList = postList
        this.postItem = postList.shift()
    },
  });

});

module.exports = router;
