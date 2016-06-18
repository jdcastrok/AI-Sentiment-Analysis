'use strict'

var controlled = require('./learningService.js');
var autonomous = require('./learningService.js');
//var autonomous = require('./autonomousLearningService.js');
var genModel = require('./genModelLearningService.js');

//autonomous.learn(function(response) {if (response.success) {console.log("bien")} else {console.log("mal")}});

var fs = require('fs');



/*
fs.readFile("./positivo.txt", 'utf8', function (err, data) {
  if (err) {
    console.log(err);
  } else {
    var pos = data;
    //console.log(pos);
    fs.readFile("./negativo.txt", 'utf8', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var neg = data;
        //console.log(neg);
        //callback({"success" : true, "data" : stopWords});
        controlled.learn(
          {"type" : "controlled", "data" : [
          {"text" : pos, "sent" : "pos"},
          {"text" : neg, "sent" : "neg"}]},
          4, 3,
          //callback
          function(response) {
            console.log("Learn callback in");
            if (response.success) {
              console.log("bien")
              //console.log(response);
            }
            else {
              console.log("mal");
              //console.log(response)
            }});
      }
    });
  }
});*/





autonomous.learn({"type":"auto"},4, 3, function(response){
  if (response.success) {
    console.log("bien")
  }
  else {
    console.log("mal");
  }

});








/*var foo =*/ /*controlled.learn(
  //texts*/
/*  );*//**/
/**/
//foo();


//genModel.startGenModel(function(response) {
//  if (response.success) {
//    dataAccessTest.unlockLearningProcess({success: true}, function (response) {
//      console.log(response);
//      //callback({"success" : true});//se supone que updateModels hizo todo lo demás para manejar errores
//    });
//  } else {
//    console.log(response);
//    //que pasa si falla la generacion de las colecciones modelo?
//    //dataAccessTest.unlockLearningProcess({"success" : false}, function(response) {
//    //  callback({"success" : false});
//    //});
//  }
//});


[
  {
    "sent" : "pos", "words" :
    [
      {"word" : "bueno", "occur" : 4},
      {"word" : "buenisimo", "occur" : 2},
      {"word" : "perro", "occur" : 2},
      {"word" : "casa", "occur" : 3}
    ]
  },
  {
    "sent" : "pos", "words" :
    [
      {"word" : "bueno", "occur" : 4},
      {"word" : "rico", "occur" : 2},
      {"word" : "perfecto", "occur" : 2},
      {"word" : "cachete", "occur" : 3}
    ]
  },
  {
    "sent" : "neg", "words" :
    [
      {"word" : "malo", "occur" : 4},
      {"word" : "malisimo", "occur" : 2},
      {"word" : "perro", "occur" : 2}
    ]
  },
  {
    "sent" : "pos", "words" :
    [
      {"word" : "malo", "occur" : 4},
      {"word" : "regular", "occur" : 2},
      {"word" : "bueno", "occur" : 2},
      {"word" : "muy", "occur" : 3}
    ]
  },
  {
    "sent" : "neg", "words" :
    [
      {"word" : "gato", "occur" : 4},
      {"word" : "muerte", "occur" : 2},
      {"word" : "perro", "occur" : 2}
    ]
  }
]











/*
var util = require('util');
var dataAccess = require('../dataAccess/learningRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

exports.learn = function(request, callback) {
  var textsArray = request.texts;

  dataAccess.getStopWords(function (stopWords) {
    var sentimentWords = {"neg" : [], "pos" : []};

    for (var i = 0; i < textsArray.length; i++) {
      var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i]."text"),stopWords));
      if (textsArray[i]."sent" == "neg") {
        sentimentWords.neg = utilitiesService.groupBySentiment(sentimentWords.neg, wordOcurrences);
      } else {
        sentimentWords.pos = utilitiesService.groupBySentiment(sentimentWords.pos, wordOcurrences);
      }
    }

    dataAccess.createBackup([{'collection' : 'historicalPositive'},{'collection' : 'historicalNegative'}], function(response) {//es necesario recibir algo?
      dataAccess.updateHistoricals({'data' : sentimentWords}, function (response) {
        console.log(response.resultCode);

        if (response.resultCode == 200) {
          console.log(response.resultCode);
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


var r=
{
  'texts':  [
              {
                '"text"': "hello World!m my name is Yisus hehe",
                '"sent"': "pos"
              },
              {
                '"text"': "hello World!m my name is Yisus hehe",
                '"sent"': "neg"
              },
              {
                '"text"': "hello World!m my name is Yisus hehe",
                '"sent"': "pos"
              }
            ]
};
exports.learn(r, function(n) {
  console.log(n);
});*/
