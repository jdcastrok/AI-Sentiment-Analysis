var analysisRepository = require('../dataAccess/analysisRepository.js'); 

exports.analyzeText = function(params, callback) {
  analysisRepository.getOneMethod(params, function(data){
        callback(data);
    });
};
