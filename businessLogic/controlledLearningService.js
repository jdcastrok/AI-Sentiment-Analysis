'use strict'

var util = require('util');
var dataAccess = require('../dataAccess/learningRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

exports.learn = function(request, callback) {
  var textsArray = request.texts;

  dataAccess.getStopWords(function (stopWords) {
    var sentimentWords = {'neg' : [], 'pos' : []};

    for (var i = 0; i < textsArray.length; i++) {
      var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),stopWords));
      if (textsArray[i].sent == 'neg') {
        sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, wordOcurrences);
      } else {
        sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, wordOcurrences);
      }
    }

    dataAccess.createBackup([{'collection' : 'historicalPositive'},{'collection' : 'historicalNegative'}], function(response) {//es necesario recibir algo?
      dataAccess.updateHistoricals({'data' : sentimentWords}, function (response) {

        if (response.resultCode == 200) {
          mathService.updateModels(function(response) {
            callback(response);//se supone que updateModels hizo todo lo demás para manejar errores
          });
        } else {
          //paso algun error
          dataAccess.restoreBackup([{'collection' : 'historicalPositive'},{'collection' : 'historicalNegative'}], function(response) {
            if (response.resultCode == 200) {//se restauró el backup después de que algo malo pasara
              callback({'resultCode':-1});// "algún código de error que indique que falló el proceso, pero se recuperó la BD?"
            } else {
              //pasó algo malo y no se restauró
              callback({'resultCode':-1}); //"algún código que indique que falló el proceso y no se pudo restaurar el backup"
            }
          });
        }
      });
    }); //es necesario aquí???
  });
}
