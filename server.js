/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

// development only



/**
 * Routes
 */

app.get('/:name', function(req,res) {
  res.sendfile(req.params.name);
});
// redirect all others to the index (HTML5 history)
app.get('*', function(req,res) {
  res.sendfile('./views/index.html');
});


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
