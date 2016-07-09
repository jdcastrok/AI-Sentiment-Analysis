var connection = require("./connection.js");


/*
Recupera la colección de stopWords
  Entrada:
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: array con los documentos de la collección, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.getStopWords = function(callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	};
	var httpData = {
		"collection": JSON.stringify("stopWords")
	};
	connection.httpRequest(httpConfig, httpData, function (response) {
		if (response.data.length > 0) {
			callback(response);
		} else {
			console.log(require('util').inspect(response, { depth: null }));
			console.log("No se encontraron stopwords");
			response.success = false;
			callback(response);
		}
	});
};


/*
Recupera las colecciones de conocimiento histórico o modelo
  Entrada:
        knowledgeType, //String, tipo de conocimiento; "Model": colecciones modelo, "Historical": colecciones históricas
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(conocimientoSolicitado)

         Éxito:
         {
	success: false,
	data: {
		"pos" 	// array con los documentos de la colección de conocimiento positivo
		"neg"	// array con los documentos de la colección de conocimiento negativo
	        },
	message: 400
        }

        Fracaso:
        {
	success: false,
	data: null,
	message: 400
        }
*/

exports.getKnowledgeDB = function(knowledgeType, callback){
	console.log("9.Inside -> getKnowledgeDB");
	var knowledgeDB = {
		"pos": [],
		"neg": []
	};
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	};
	var httpData = {
		"collection": JSON.stringify("positive" + knowledgeType + "Knowledge")
	};
	connection.httpRequest(httpConfig, httpData,
		function (res) {
			if (res.success) {
				knowledgeDB.pos = res.data;
				httpConfig = {
					"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
					//"uri": "http://104.245.34.129/sentimentAnalysis/v1/getCollection/",
					"method": "GET"
				};
				httpData = {
					"collection": JSON.stringify("negative" + knowledgeType + "Knowledge")
				};
				connection.httpRequest(httpConfig, httpData,
					function (res) {
						if (res.success) {
							knowledgeDB.neg = res.data;
							callback({
								"success": true,
								"data": knowledgeDB,
								"message": 200
							});
						} else {
							callback(res);
						}
					});

			} else {
				callback(res);
			}
		}
	);

};


/*
Recupera la colección learningQueue
  Entrada:
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: array con los documentos de la collección, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.getLearningQueue = function(callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	};
	var httpData = {
		"collection": JSON.stringify("learningQueue")
	};
	connection.httpRequest(httpConfig, httpData, callback);
};

/*
Recupera la colección learningQueue
  Entrada:
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: array con los documentos de la collección, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/

exports.getAnalisysStatistics = function(callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	};
	var httpData = {
		"collection": JSON.stringify("analysisStatistics")
	};
	connection.httpRequest(httpConfig, httpData, callback);
};

/*
Actualiza  las colecciones de conocimiento histórico o modelo
  Entrada:
  	knowledgeType, //String, tipo de conocimiento; "Model": colecciones modelo, "Historical": colecciones históricas,

  	knowledgeDB// JSON con los documentos que serán insertados en las colecciónes
  	{
	   "pos" 	// array con los documentos de la colección positiva del conocimiento dado
	   "neg"	// array con los documentos de la colección negativa  del conocimiento dado
	},
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: null, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.updateKnowledgeDB = function(knowledgeType, knowledgeDB, callback){
	console.log("19.Inside -> updateKnowledgeDB");
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/updateCollection/",
		"method": "PUT"
	};
	var httpData = {
		"collection": JSON.stringify("positive" + knowledgeType + "Knowledge"),
		"documents": JSON.stringify(knowledgeDB.pos)
	};
	connection.httpRequest(httpConfig, httpData,
		function (res) {
			if (res.success) {
				httpConfig = {
					"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
					//"uri": "http://104.245.34.129/sentimentAnalysis/v1/updateCollection/",
					"method": "PUT"
				};
				httpData = {
					"collection": JSON.stringify("negative" + knowledgeType + "Knowledge"),
					"documents": JSON.stringify(knowledgeDB.neg)
				};
				connection.httpRequest(httpConfig, httpData,
					function (res) {
						callback(res);
					}
				);

			} else {
				callback(res);
			}
		}
	);
};



/*
Actualiza  la colección learningQueue
  Entrada:
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: null, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.updateLearningQueue = function(data, callback){
	var httpConfig = {
		//"uri": "http://localhost:9000/sentimentAnalysis/v1/replaceCollection/",
		"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
		"method": "PUT"
	};
	var httpData = {
		"collection": JSON.stringify("learningQueue"),
		"documents": JSON.stringify(data)
	};
	connection.httpRequest(httpConfig, httpData, function(response){
		if(response.success){
			callback({"success": true,"data": null,"message": 200});
		}else {
			console.log("BAD -_-");
			console.log(response);
			callback({"success": false,"data": null,"message": 400});
		}
	});
};

exports.deleteLearningQueue = function(callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/replaceCollection/",
		//"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
		"method": "PUT"
	};
	var httpData = {
		"collection": JSON.stringify("learningQueue"),
		"documents": JSON.stringify([])
	};
	connection.httpRequest(httpConfig, httpData, function(response){
		if(response.success){
			callback({"success": true,"data": null,"message": 200});
		}else {
			console.log("BAD -_-");
			console.log(response);
			callback({"success": false,"data": null,"message": 400});
		}
	});
};


/*
Actualiza  la colección learningQueue
  Entrada:
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida:
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: null, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.updateAnalisysStatistics = function(data, callback){
	var httpConfig = {
		//"uri": "http://localhost:9000/sentimentAnalysis/v1/replaceCollection/",
		"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
		"method": "PUT"
	};
	var httpData = {
		"collection": JSON.stringify("analysisStatistics"),
		"documents": JSON.stringify(data)
	};
	connection.httpRequest(httpConfig, httpData, function(response){
		if(response.success){
			callback({"success": true,"data": null,"message": 200});
		}else {
			console.log("BAD -_-");
			console.log(response);
			callback({"success": false,"data": null,"message": 400});
		}
	});
};

exports.updateLogs = function(logs, typeLogs,callback){
	console.log("TYPE: "+typeLogs);
	console.log("-------------------------------");
	var jsonArray = toJson(logs);
	//console.log(jsonArray);
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/insertCollection/",
		//"uri": "http://104.245.34.129/sentimentAnalysis/v1/updateCollection/",
		"method": "POST"
	};
	var httpData = {
		"collection": JSON.stringify('p'+logs.models.nPer+'k'+logs.models.nPerToTake+typeLogs),
		"documents": JSON.stringify([jsonArray])
	};
	connection.httpRequest(httpConfig, httpData, function(response){
		if(response.success){
			callback({"success": true,"data": null,"message": 200});
		}else {
			console.log("BAD -_-");
			console.log(response);
			callback({"success": false,"data": null,"message": 400});
		}
	});
};


var toJson = function(info){
	var newArray = {
	success : info.success,
	data : info.data,
	message : info.message,

	limitPos : info.models.limitPos,
	limitNeg : info.models.limitNeg,
	numPos : info.models.numPos,
	numNeg : info.models.numNeg,
	nPer : info.models.nPer,
	nPerToTake : info.models.nPerToTake,
	/*modelsPos : info.models.pos,
	//modelsNeg : info.models.neg,
	//historicalPos : info.historicals.pos,
	//historicalNeg : info.historicals.neg,
	//newWordsPos : info.newWords.pos,
	//newWordsNeg : info.newWords.neg,
	//stopWords : info.stopWords,*/
	type : info.type,
	time : info.time};

	return newArray;
}
