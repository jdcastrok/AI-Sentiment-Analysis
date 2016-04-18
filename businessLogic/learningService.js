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
exports.learn = function (request, callback) {
  if (request.type == "auto") {
    autonomousLearn(function (response) {
      if (response.success) {
        //se realizó exitosamente el aprendizaje
      } else {
        //error
        callback(response);
      }
    });
  } else if (request.type == "controlled") {
    controlledLearn(request.data, function (response) {
      if (response.success) {
        //exito
        callback(response);
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
function autonomousLearn(callback) {
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
      commonLearning(sentimentWords, function (response) {
        if (response.success) {
          //todo bien
          //vacío la colección learningQueue
          dataAccess.updateLearningQueue(function (response) {
            console.log(response);
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
function controlledLearn(request, callback) {
  var textsArray = request.data;
  //debería hacerse un lock a la BDtrue
  //dataAccessTest.lockLearningProcess(function (response) {

  //get the stopwords from database
  dataAccess.getStopWords(function (response) {
    if (response.success) {
      //las stopwords se obtuvieron con exito
      //tokenizo, agrupo palabras y separo por sentimiento
      var sentimentWords = getWordsPerSentiment(response.data, request);
      //calls the next steps (common to both types of learning)
      commonLearning(sentimentWords, function (response) {
        if (response.success) {
          //todo bien
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
function commonLearning(newWords, callback) {
  //obtengo la colección histórica
  dataAccess.getKnowledgeDB("Historical", function (response) {
    if (response.success) {
      // se obtuvieron las colecciones históricas
      // se actualizan las colecciones históricas con las palabras recientemente categorizadas
      var historicals = updateHistoricals(response.data, newWords);
      //se generan las colecciones modelo
      genModel.generateModel(historicals, function (response) {
        //console.log(response);
        if (response.success) {
          //las colecciones modelo se generaron correctamente
          //se busca actualizar ambas
          updateDB(historicals, response.data, function (response) {
            console.log(response);
            if (response.success) {
              //se actualizaron exitosamente las colecciones
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
  dataAccess.updateKnowledgeDB("Historical", historicals, function (response) {
    if (response.success) {
      //si se pudo actualizar las colecciones históricas
      dataAccess.updateKnowledgeDB("Model", models, function (response) {
        //ambas se insertaron exitosamente
        callback(response);
      });
    } else {
      callback(response);
    }
  });
}
