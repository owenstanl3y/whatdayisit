var express = require('express');
var router = express.Router();
var fs = require('fs');
var data = fs.readFileSync('dates.json', 'utf8');
var json = JSON.parse(data);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { today: json[getDate()] , tomorrow: json[getTomorrow()] });
});

function getDate() {
  return new Date().getMonth() + "-" + new Date().getDate();
}

function getTomorrow() {
  return new Date().getMonth() + "-" + (new Date().getDate() + 1);
}

module.exports = router;

