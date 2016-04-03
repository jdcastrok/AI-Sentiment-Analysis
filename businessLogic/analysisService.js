var analysisRepository = require('../dataAccess/analysisRepository.js'); 

exports.analyzeText = function(aRequest, aResponse) {
  
  analysisRepository.getOneMethod(aRequest.params, function(data){
        aResponse.send(data);
    });
};
