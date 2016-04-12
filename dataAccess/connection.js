//importa paquete needle para hacer las peticiones http
var needle = require('needle');

/*     
Entrada:
        config{
            uri, // ejemplo: 'http://localhost:9000/sentimentAnalysis/v1/updateCollection/'
            method // nombre del método: GET, POST, PUT, DELETE
        }  
        body  //puede ser null si se usa GET, en caso contrario todo el contenido del body se tiene que convertir a string con el método JSON.stringify y cada key tiene que ir definida con comillas dobles ("), por ejemplo
            {
                "key1": JSON.stringify(['stringValue', 243, true]), 
                "key2": JSON.stringify([{"word": "inundación", "ocurrences": 34}])
            }, 
            callback // function(res){...} -> recibe la respuesta (res) para ser administrada externamente
*/
exports.httpRequest = function(config, body, callback){
    needle.request(config.method, config.uri, body, function (err, res) {
        if (err) {
            callback({
                success: false,
                data: null,
                message: 400
            })
        } else {
            callback(res.body)
        }
    });
};


