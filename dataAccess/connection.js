//importa paquete request para hacer las peticiones http
var request = require("request");

exports.httpRequest = function(config, data, callback){
    /*
        config:{
            uri, //dirección url del método
            method // GET, POST, PUT, DELETE
        }

        data // json con la información a enviar
    */
    console.log('httpRequest: data');
    console.log(data);
    request({
      uri: config.uri,
      method: config.method,
      form: data
    }, function(error, res, data) {
      if(error){
        callback({
            success: false,
            data: null, 
            message: 400
        });
      } else {
        callback(data);
      }
    });

}
