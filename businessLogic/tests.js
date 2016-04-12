'use strict'

var controlled = require('./controlledLearningService.js');
var autonomous = require('./autonomousLearningService.js');

autonomous.learn(function(response) {if (response.success) {console.log("bien")} else {console.log("mal")}});
/*
var foo = controlled.learn(
  //texts
  {texts:[
    {text: "todo el mundo debe ser feliz :)", sent: 'pos'},
    {text: "todo fue divertidisimo lol", sent: 'pos'},
    {text: "me alegra ser feliz", sent: 'pos'},
    {text: "no me gusto la comida, sabia muy fea hehe", sent: 'neg'},
    {text: "hola mundo", sent: 'pos'},
    {text: "lo peor de la vida es la muerte", sent: 'neg'},
    {text: "no me gusta programar en javascript", sent: 'neg'},
    {text: "el examen estubo para morir", sent: 'neg'},
    {text: "el mundo esta de muerte, quiero morir, adios", sent: 'neg'},
    {text: "esto esta funcionando bien, me gusta", sent: 'pos'},
    {text: "me gusta esto, esta vida esta bien", sent: 'pos'},
    {text: "prueba de sentimiento positivo", sent: 'pos'},
    {text: "adios mundo cruel", sent: 'neg'}]},
  //callback
  function(response) {if (response.success) {console.log("bien")} else {console.log("mal")}});*/











/*
var util = require('util');
var dataAccess = require('../dataAccess/learningRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

exports.learn = function(request, callback) {
  var textsArray = request.texts;

  dataAccess.getStopWords(function (stopWords) {
    var sentimentWords = {'neg' : [], 'pos' : []};

    for (var i = 0; i < textsArray.length; i++) {
      var wordOcurrences = utilitiesService.groupByOcurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(textsArray[i].text),stopWords));
      if (textsArray[i].sent == 'neg') {
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
                'text': "hello World!m my name is Yisus hehe",
                'sent': 'pos'
              },
              {
                'text': "hello World!m my name is Yisus hehe",
                'sent': 'neg'
              },
              {
                'text': "hello World!m my name is Yisus hehe",
                'sent': 'pos'
              }
            ]
};
exports.learn(r, function(n) {
  console.log(n);
});*/
