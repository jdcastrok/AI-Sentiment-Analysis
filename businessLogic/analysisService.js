'use strict'

var dataAccess = require('../dataAccess/analysisRepository.js');
var utilitiesService = require('./utilitiesService.js');

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
            //model = response.models = {'neg' : [], 'pos' : []}
            var expectedPos = utilitiesService.wordsIntersect = function(sentimentWords.words, response.models.pos);
            var expectedNeg = utilitiesService.wordsIntersect = function(sentimentWords.words, response.models.neg);

            

          }else {
            //ERROR obteniendo modelos
          }
        });


    }else {
      console.log("ERROR");
    }
  });
}

/*
var test = function(request){
  var response = {data:[{word:'nh'}]};
  var textsArray = request.texts;
  var sentimentWords = {'words' : []};

    //transformo cada texto para obtener sus palabras, agruparlas por apariciones
    for (var i = 0; i < textsArray.length; i++) {
      var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),response.data));
      sentimentWords.words = utilitiesService.groupBySentiment(sentimentWords.words, wordOcurrences);
    }
    console.log(sentimentWords);
}
test({texts:[{text:"ij nh bg vf hhb"},{text:"ksd7 hds6 sdhc ystd6 jha"},{text:"mo ko ih y g"}]});
*/
