var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = fs.readFileSync('dates.json', 'utf8');
var json = JSON.parse(data);


let date = new Date();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { today: json[date.getMonth() + "-" + date.getDate()] , tomorrow: json[date.getMonth() + "-" + (date.getDate() + 1)] });
});

module.exports = router;
