'use strict'

var util = require('util');
var dataAccess = require('../dataAccess/learningRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

exports.learn = function(request, callback) {
  var textsArray = request.texts;

  dataAccess.lockLearningProcess(function (response) {
    //si la bd está disponible
    if (response.success) {
      dataAccess.getStopWords(function (response) {
        //si se pudieron consultar las stopWords
        if (response.success) {
          var sentimentWords = {'neg' : [], 'pos' : []};

          //transformo cada texto para obtener sus palabras, agruparlas por apariciones y sentimiento
          for (var i = 0; i < textsArray.length; i++) {
            var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),response.data));
            if (textsArray[i].sent == 'neg') {
              sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, wordOcurrences);
            } else {
              sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, wordOcurrences);
            }
          }

          dataAccess.updateHistoricals(sentimentWords, function (response) {
            //si se pudo actualizar exitosamente
            if (response.sucess) {
              mathService.updateModels(function(response) {
                dataAccess.unlockLearningProcess({result : 'sucess'});
                callback(response);//se supone que updateModels hizo todo lo demás para manejar errores
              });
            } else {
              //falló algo al actualizar los históricos
              dataAccess.unlockLearningProcess({result : 'failed'});
            }
          }); //es necesario aquí???
        } else {
          //no se pudieron traer las stopWords
        }
      });
    } else {
      //se esta realizando otro proceso de aprendizaje
    }
  });
}
