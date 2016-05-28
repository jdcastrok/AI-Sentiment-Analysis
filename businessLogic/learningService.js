'use strict'

var util = require('util');
var dataAccessTest = require('../dataAccess/learningRepository.js');
var dataAccess = require('../dataAccess/sentimentRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');
var genModel = require('./genModelLearningService.js');

//recibe una solicitud de aprendizaje indicando si este es autónomo o controlado
//si es controlado se recibe también un arreglo de textos con su respectivo sentimiento
//formato de request:
//  {
//    "type" : "auto" | "controlled",
//    "data" :
//      [
//        {
//          "sent" : "pos" | "neg",
//          "text" : "Lorem ipsum dolor sit amet..."
//        },
//        {
//          ...
//        }
//      ] | null
//  }
exports.learn = function (request, nPer,nPerToTake, callback) {
  console.log("1.Inside -> Learn");
  if (request.type == "auto") {
    autonomousLearn(nPer,nPerToTake,function (response) {
      if (response.success) {
        //se realizó exitosamente el aprendizaje
      } else {
        //error
        callback(response);
      }
    });
  } else if (request.type == "controlled") {
    console.log("2.Call -> Controlled");
    controlledLearn(request.data, nPer,nPerToTake, function (response) {
      if (response.success) {
        //exito
        //////////////////////////////////////////////////////////LOGS
        var today = new Date();
        today = today.getTime();

        response.type = request.type;
        response.time = today;


        ////LOGS
        console.log("23.Call logs");
        ////
        updateLogs(response, response.type,function(res){
          console.log("24.Inside logs");
          if(res.success){
            console.log("25.1 logs");
            callback(res);
          }else {
            console.log("25.2 logs");
            res.data = "Logs db error!";
            res.message = 1044;
            callback(res);
          }
        });

        ///////////////////////////////////////////////////////////////
        //callback(response);
      } else {
        //fracaso
        callback(response);
      }
    });
  } else {
    //type inválido
    callback({"success" : false, "data" : null, "status" : 400 /* ?? */});
  }
};

//reads from DB the analysis results that are pending to learn
//iterates over the analysis and for each of them
//clasifies its words into the respective sentiment
//when all words are grouped by sentiment
//call the next common steps and waits for the response
function autonomousLearn(nPer,nPerToTake,callback) {
  //debería bloquearse la BD

  dataAccess.getLearningQueue (function (response) {
    //se obtienen las palabras por aprender
    if (response.success) {
      var sentimentWords = {"neg" : [], "pos" : []};

      //se itera sobre los resultados de análisis
      for (var i = 0; i < response.data.length; i++) {
        //si el sentimento del análisis es neg o pos
        if (response.data[i].sent == "neg") {
          //agrupa las palabras del análisis con las positivas
          sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, response.data[i].words);
        } else {
          //agrupa con las negativas
          sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, response.data[i].words);
        }
      }

      //calls the next steps (common to both types of learning)
      commonLearning(sentimentWords, nPer,nPerToTake, function (response) {
        if (response.success) {
          //todo bien
          //vacío la colección learningQueue
          dataAccess.updateLearningQueue(function (response) {
            //console.log(response);
            if (response.success) {
              //se limpió con éxito
              callback(response);
            } else {
              //falló
              callback(response);
            }
          })
        } else {
          //todo mal
          callback(response);
        }
      });
    } else {
      callback(response);
    }
  });//??
}

//recibe un arreglo de objetos json que representan textos por aprender,
//cada uno de estos objetos contiene dos llaves
// sent: el sentiemiento al que pertenece el texto
// text: el texto como tal
//cada uno de los textos es dividido en palabras (tokenizado) y se eliminan las palabras
//poco representaivas (stopwords), se cuenta el número de apariciones para cada palabra distinta
//finalmente se agrupan las palabras de todos los textos por sentiemiento,
//según lo indique la llave "sent"
function controlledLearn(request, nPer, nPerToTake, callback) {
  console.log("3.Inside Controlled Learning");
  var textsArray = request.data;
  //debería hacerse un lock a la BDtrue
  //dataAccessTest.lockLearningProcess(function (response) {

  //get the stopwords from database
  dataAccess.getStopWords(function (response) {
    console.log("4.Response -> getStopWords");
    if (response.success) {
      //las stopwords se obtuvieron con exito
      //tokenizo, agrupo palabras y separo por sentimiento

      ////// LOGS
      console.log("5.Call -> getWordsPerSentiment");
      //////

      var stopWords = response.data;
      var sentimentWords = getWordsPerSentiment(stopWords, request);
      //calls the next steps (common to both types of learning)
      console.log("6.Call -> commonLearning");
      commonLearning(sentimentWords, nPer,nPerToTake, function (response) {
        if (response.success) {
          //todo bien
          response.stopWords = stopWords;
          callback(response);
        } else {
          //todo mal
          callback(response);
        }
      });
    } else {
      callback(response);
    }
  });
}

//steps that are common on both learning processes
//get historical knowledge collections from DB
//upserts the recently analyzed words into respective collection
//generates both model collections
//updates all collections on DB
//asserts if everything went OK and unlocks the DB
function commonLearning(newWords,nPer,nPerToTake, callback) {

  ////// LOGS
  console.log("7.Inside -> commonLearning");
  console.log("8.Call -> getKnowledgeDB");
//////

  //obtengo la colección histórica

  dataAccess.getKnowledgeDB("Historical", function (response) {
    console.log("10.Response -> getKnowledgeDB");
    if (response.success) {
      // se obtuvieron las colecciones históricas
      // se actualizan las colecciones históricas con las palabras recientemente categorizadas
      console.log("11.Call -> updateHistoricals");
      var historicals = updateHistoricals(response.data, newWords);
      //se generan las colecciones modelo
      console.log("13.Call -> generateModel");
      genModel.generateModel(historicals, nPer,nPerToTake,  function (response) {
        console.log("15.Response -> generateModel");
        if (response.success) {
          //las colecciones modelo se generaron correctamente
          //se busca actualizar ambas
          console.log("16.Call -> updateDB");
          updateDB(historicals, response.data, function (response) {
            console.log("22.Response -> updateDB");
            //console.log(response);
            if (response.success) {
              //se actualizaron exitosamente las colecciones

              ////LOGS
              response.newWords = newWords;
              ///////

              callback(response);
            } else {
              //en cada uno de los else debería levantarse el bloqueo sobre la BD
              //manejo de errores
              callback(response);
            }
          });
        } else {
          callback(response);
        }
      });//??
    } else {
      callback(response);
    }
  });
}

//tokeniza cada uno de los textos, elimina las stopwords, y cuenta las apariciones
//de cada palabra, luego agrupa las palabras por sentimiento
function getWordsPerSentiment(stopWords, texts) {
  var sentimentWords = {"neg" : [], "pos" : []};

  //transformo cada texto para obtener sus palabras, agruparlas por apariciones y sentimiento
  for (var i = 0; i < texts.length; i++) {
    var wordOccurrences = utilitiesService.groupByOccurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(texts[i].text),stopWords));
    if (texts[i].sent == "neg") {
      sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, wordOccurrences);
    } else {
      sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, wordOccurrences);
    }
  }

  return sentimentWords;
}

//actualiza ambas colecciones con las nuevas palabras
function updateHistoricals(historicals, newWords) {
  console.log("12.Inside -> updateHistoricals");
  historicals.pos = updateCollection(historicals.pos, newWords.pos);
  historicals.neg = updateCollection(historicals.neg, newWords.neg);

  return historicals;
}

//itera la lista de palabras y las compara con las palabras de la colleción
//si encuentra coincidencias actualiza las ocurrencias en la colección
//si no la agrega al final
function updateCollection(collection, newWords) {
  for (var i = 0; i < newWords.length; i++) {
    var j = 0;
    for (j; j < collection.length; j++) {
      if (collection[j].word == newWords[i].word) {
        collection[j].occur += newWords[i].occur;
        break;
      }
    }
    if (j == collection.length) {
      collection[j] = newWords[i];
    }
  }

  return collection;
}

//recibe las colecciones históricas y modelo para enviarlas a la BD y que se actualicen
function updateDB(historicals, models, callback) {
  console.log("17.Inside -> updateDB");
  console.log("18.Call -> updateKnowledgeDB HISTORICAL");
  dataAccess.updateKnowledgeDB("Historical", historicals, function (response) {

    ////// LOGS
    console.log("20.Response -> updateKnowledgeDB HISTORICAL");
    //////

    if (response.success) {
      //si se pudo actualizar las colecciones históricas
      console.log("21.Call -> updateKnowledgeDB MODEL");
      dataAccess.updateKnowledgeDB("Model", models, function (response) {

        ////// LOGS
        console.log("21.1.Response -> updateKnowledgeDB MODEL");
        //console.log(response);
        response.models = models;
        response.historicals = historicals;

        //ambas se insertaron exitosamente
        callback(response);
      });
    } else {
      console.log("21.2.Response -> updateKnowledgeDB MODEL");
      //console.log(response);
      callback(response);
    }
  });
}


function updateLogs(data, typeLogs, callback){
  dataAccess.updateLogs(data, typeLogs,function(response){
    if(response.success){
			callback({"success": true,"data": null,"message": 200});
		}else {
			callback({"success": false,"data": null,"message": 400});
		}
  });
}
