var express = require('express');
var router = express.Router();

var util = require('../service/util.js');

var superagent = require('superagent');
var observe = require('observe.js');
var cheerio = require('cheerio');
var path = require('path');
var url = require('url');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var name = req.query.name;
  var detailUri = req.query.url;
  var suffix = util.getSuffix(detailUri);
  console.log(suffix);

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
      $('.piclist ul li a').each(function(){
        var singleHref = $(this).attr('href');
        var singleName = $(this).find('span').html();
        if(!singleHref.startsWith("http://www.192tt.com")){
          singleHref = "http://www.192tt.com" + singleHref;
        }
        var single = {};
        single.name = singleName;
        single.href = singleHref;
        console.log(JSON.stringify(single));
        itemList.push(single);
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
      var fileLink = "./public/data/category_list_"+suffix+".json";
      //check 和 save
      fs.stat(fileLink, function(err, stat){
        if(stat&&stat.isFile()) {
          console.log('文件存在');
        } else {
          fs.writeFileSync(fileLink, JSON.stringify(returnList));
        }
        fs.readFile(fileLink, "utf8", function(err, data){
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
          fs.unlinkSync(fileLink);
          fs.writeFileSync(fileLink, JSON.stringify(returnList));
          var data = {"itemList": itemList};
          res.render('detail', {itemList: itemList});
        });
      });
    }
  });

  fetch.url = detailUri;
  fetch.query = "";
});

module.exports = router;

