var analysisService = require('../businessLogic/analysisService.js'); 

exports.analyzeText = function(aRequest, aResponse) {
  analysisService.analyzeText(aRequest.params, function(data){
        aResponse.send(data);
    });
};
