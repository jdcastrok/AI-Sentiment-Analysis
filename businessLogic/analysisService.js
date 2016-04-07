'use strict'

var dataAccess = require('../dataAccess/analysisRepository.js');

/*exports.analyzeText = function(params, callback) {
  analysisRepository.getOneMethod(params, function(data)r
        callback(data);
    });
};*/

/*
analysisRepository.getStopWords(function (res) {
  console.log('analysisRepository.getStopWords:');
  console.log(res);
}); */


exports.analyzeText = function(request, callback){
  var textsArray = request.texts;
  dataAccess.getStopWords(function (response) {
    if (response.success) {
      var sentimentWords = {'words' : []};
        //transformo cada texto para obtener sus palabras, agruparlas por apariciones
        for (var i = 0; i < textsArray.length; i++) {
          var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),response.data));
          sentimentWords.words = utilitiesService.groupBySentiment(sentimentWords.words, wordOcurrences);
        }

        dataAccess.getModels(function(response){
          if(response.success){

          }else {
            //ERROR obteniendo modelos
          }
        });


    }else {
      //ERROR obteniendo stopWords
    }
  });

}
