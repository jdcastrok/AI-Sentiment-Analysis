bodyParser = require('body-parser');
var analysisService = require('./businessLogic/analysisService.js');

//-------------------------------------------------------------------------
var express       = require('express'),
      app              = express(),
      server          = require('http').createServer(app),
      port              = 3000;
//-------------------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//define ubición del directorio principal
app.use('/sentiment-analysis', express.static(__dirname + '/app'));

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
//devuleve un usuario por medio del ID
app.get('/analyzeText/:data', analysisService.analyzeText);

//End: Routing

//muestra cuál puerto se escucha
server.listen(port, function(){
  console.log('Server listening on port: ' + port);
});