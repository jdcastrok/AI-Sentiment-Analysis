'use strict'

var util = require('util');
var dataAccess = require('../dataAccess/learningRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');
var genModel = require('./genModelLearningService.js')

exports.learn = function(request, callback) {
  var textsArray = request.texts;

  dataAccess.lockLearningProcess(function (response) {
    //si la bd está disponible
    if (response.success) {
      dataAccess.getStopWords(function (response) {
        //si se pudieron consultar las stopWords
        if (response.success) {
          var sentimentWords = {"neg" : [], "pos" : []};

          //transformo cada texto para obtener sus palabras, agruparlas por apariciones y sentimiento
          for (var i = 0; i < textsArray.length; i++) {
            var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),response.data));
            if (textsArray[i].sent == "neg") {
              sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, wordOcurrences);
            } else {
              sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, wordOcurrences);
            }
          }

          dataAccess.updateHistoricals(sentimentWords, function (response) {
            //si se pudo actualizar exitosamente
            if (response.sucess) {
              //se ejecuta la generación de colecciones modelo
              genModel.startGenModel(function(response) {
                if (response.success) {
                  dataAccess.unlockLearningProcess({success: true}, function (response) {
                    callback({"success" : true});//se supone que updateModels hizo todo lo demás para manejar errores
                  });
                } else {
                  //que pasa si falla la generacion de las colecciones modelo?
                  dataAccess.unlockLearningProcess({"success" : false}, function(response) {
                    callback({"success" : false});
                  });
                }
              });
            } else {
              //falló algo al actualizar los históricos
              dataAccess.unlockLearningProcess({success: false}, function(response) {
                callback(response);
              });
            }
          });
        } else {
          //no se pudieron traer las stopWords
          dataAccess.unlockLearningProcess({"success" : false}, function(response) {
            callback({"success" : false});
          });
        }
      });
    } else {
      //se esta realizando otro proceso de aprendizaje
      dataAccess.unlockLearningProcess({"success" : false}, function(response) {
        callback({"success" : false});
      });
    }
  });
}
