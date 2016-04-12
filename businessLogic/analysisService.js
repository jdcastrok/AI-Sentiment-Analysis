'use strict'
var sentimentRepository = require('../dataAccess/sentimentRepository.js'); 
var utilitiesService = require('./utilitiesService.js');



/*
<<<<<<< HEAD
//ejecución de ejemplo
sentimentRepository.getStopWords(function (res) {
  console.log('sentimentRepository.getStopWords:');
  console.log(res);
});

//ejecución de ejemplo
sentimentRepository.updateKnowledgeDB(
    'Model',
    {
      "pos": [{"word": "casa", "ocurrences": 243},{"word": "verdad1", "ocurrences": 4}],
      "neg": [{"word": "inundación", "ocurrences": 34}, {"word": "problema8", "ocurrences": 1534}]
    }, 
    function (res) {
      console.log('sentimentRepository.updateKnowledgeDB: Model');
      console.log(res);
    });

//ejecución de ejemplo
sentimentRepository.updateKnowledgeDB(
    'Historical',
    {
      "pos": [{"word": "casa", "ocurrences": 243},{"word": "verdad1", "ocurrences": 4}],
      "neg": [{"word": "inundación", "ocurrences": 34}, {"word": "problema8", "ocurrences": 1534}]
    }, 
    function (res) {
      console.log('sentimentRepository.updateKnowledgeDB: Historical');
      console.log(res);
     
    });

sentimentRepository.getKnowledgeDB('Model', function (res) {
  console.log('sentimentRepository.getKnowledgeDB: Model');
  console.log(res);
});

 sentimentRepository.getKnowledgeDB('Historical', function (res) {
  console.log('sentimentRepository.getKnowledgeDB: Historical');
  console.log(res);
});
*/


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