var analysisRepository = require('../dataAccess/analysisRepository.js'); 

/*exports.analyzeText = function(params, callback) {
  analysisRepository.getOneMethod(params, function(data)r
        callback(data);
    });
};*/

analysisRepository.getStopWords(function (res) {
  console.log('analysisRepository.getStopWords:');
  console.log(res);
});
