var express = require('express');
var app = express();

app.get('/live/:', function (req, res) {
   res.send('Hello World');
});

app.get('/', function (req, res) {
   res.send('Hello World');
});

var server = app.listen(9090, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
