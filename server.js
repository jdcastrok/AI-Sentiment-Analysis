bodyParser = require('body-parser');
var analysisController = require('./controllers/analysisController.js');

//-------------------------------------------------------------------------
var express       = require('express'),
      app              = express(),
      server          = require('http').createServer(app),
      port              = 3001;
//-------------------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());




app.use('/styles',  express.static(__dirname + '/node_modules/n3-charts/'));
app.use('/styles',  express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/styles',  express.static(__dirname + '/node_modules/ui-navbar/release/css/'));
app.use('/styles',  express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist/'));
app.use('/styles',  express.static(__dirname + '/bower_components/ui-listView/dist/'));

app.use('/fonts',  express.static(__dirname + '/node_modules/bootstrap/dist/fonts/'));

app.use('/scripts',  express.static(__dirname + '/node_modules/angular/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/angular-ui-router/release/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/ui-navbar/release/js/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/n3-charts/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/bootstrap/dist/js/'));
app.use('/scripts',  express.static(__dirname + '/bower_components/ui-listView/dist/'));



//define ubición del directorio principal
app.use('/xintiment-analysis', express.static(__dirname + '/WebApp'));
app.use('/', express.static(__dirname + '/WebApp'));

//obtiene información de la peticiones entrantes
/*app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  / *console.log("headers:");
  next();
});
*/
//End: Server configuration


//Start: Routing
//procesa una lista de textos
app.post('/api/analyzeText', analysisController.analyzeText);




//End: Routing

//muestra cuál puerto se escucha
server.listen(port, function(){
  console.log('Server listening on port: ' + port);
});