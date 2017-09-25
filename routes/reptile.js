var express = require('express');
var router = express.Router();

var superagent = require('superagent');
var observe = require('observe.js');
var cheerio = require('cheerio');
var path = require('path');
var url = require('url');
var fs = require('fs');

var itemList = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('reptile');
});

router.post('/', function(req, res, next) {
  var fetchUrl = req.body.url;

  //以同步的方式：判断是否存在这个文件夹，不存在才创建
  // if (!fs.existsSync('temp')) {
  //   fs.mkdirSync('temp');
  // }
  //获取当前路径，方便读写目录跟文件
  var cwd = process.cwd();

  var fetch = observe({});

  fetch.on({
    url: function(url) {
      var that = this
      //get方法发出请求，query方法为url添加query字段（url问号背后的）
      //end方法接受回调参数，html一般在res.text中
      superagent
        .get(url)
        .query(this.query)
        .end(function(err, res) {
            if (res.ok) {
                //赋值给reptile.text，就会触发回调
                that.text = res.text
            }
        })
    },
    //触发的回调函数在这里
    text: function(text) {
      var that = this;
      itemList = [];
      //cheerio 的 load 方法返回的对象，拥有与jQuery相似的API
      var $ = cheerio.load(text);
      //根据html结构，筛选所需部分
      //这个页面我们只要标题跟对应的url
      $('.header ul li').each(function(){
        if($(this).find('a').attr('href') == fetchUrl){
          $(this).find('p a').each(function(){
            var item = {};
            item.name = $(this).text();
            item.url = $(this).attr('href');
            itemList.push(item);
          });
        }
      });
      if(itemList.length > 0){
        that.itemList = itemList;
      }
      else {

      }
    },
    itemList: function(itemList){
      var that = this;
      var returnList= [];
      //check 和 save
      fs.readFile("./public/data/category_list.json", "utf8", function(err, data){
        if(err) throw err;
        returnList = JSON.parse(data);
        for(var i=0; i<itemList.length; i++){
          var item = itemList[i];
          if(returnList[item.name]){
            var category = returnList[item.name];
            if(category.url != item.url){
              category.url = item.url
              returnList[item.name] = category;
            }
          }
          else {
            var name = item.name;
            returnList.push(item);
          }
        }
        fs.unlinkSync("./public/data/category_list.json");
        fs.writeFileSync("./public/data/category_list.json", JSON.stringify(returnList));
      });
      var data = {"itemList": itemList};
      res.send(data);
    }
  });

  fetch.url = fetchUrl;
  fetch.query = "";

});

module.exports = router;
