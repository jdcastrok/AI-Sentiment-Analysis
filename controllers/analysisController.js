var analysisService = require('../businessLogic/analysisService.js');
var learningService = require('../businessLogic/learningService.js');

exports.analyzeText = function(aRequest, aResponse) {
  analysisService.analyzeText(aRequest.body, function(data){
        aResponse.send(data);
    });
};

/*
analysisService.analyzeText('', function(data){
        console.log('analysisService: analyzeText: callback: console.log(data);');
        console.log(data);
        //aResponse.send(data);
    });*/


/*
var learingReq = {
    "type" : "auto" | "controlled",
    "data" :
      [
        {
          "sent" : "pos" | "neg",
          "text" : "Lorem ipsum dolor sit amet..."
        }]
 };

learningService.learn(learingReq, function (res) {
    console.log(res);
})
*/