var sentimentRepository = require('../dataAccess/sentimentRepository.js'); 

/*exports.analyzeText = function(params, callback) {
  sentimentRepository.getOneMethod(params, function(data)r
        callback(data);
    });
};*/

/*
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