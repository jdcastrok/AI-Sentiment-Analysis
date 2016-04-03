'use strict'

var dataAccess = require('../dataAccess/learningRepository.js');
var mathService = require('./mathService.js');

//Obtiene las colecciones historias
var getHistorical = function(callback){
  dataAccess.getHistorical(function(response){
    if(response.success){
        callback(historical);
    }else{
      //ERROR
    }
  });
};

//Recibe las colecciones historicas, un numero alpha y dos arreglos vacios
//Devuelve en cada arreglo las palabras mas representaivas de cada coleccion
//  que no sean representaivas en la otra
var filterByFrequency = function(positiveHistoric, negativeHistoric, alpha, newPositive, newNegative){
  var flagWordFound, ocurHistoric, ocurObserved;
  ocurHistoric = mathService.getOcurrency(positiveHistoric);
  ocurObserved = mathService.getOcurrency(negativeHistoric);
    for (var i = 0; i < positiveHistoric.length; i++) {
      flagWordFound = false;
      for (var j = 0; j < negativeHistoric.length; j++) {
        if(positiveHistoric[i].word == negativeHistoric[j].word){
          if( Math.abs((positiveHistoric[i].ocur/ocurHistoric) - (negativeHistoric[j].ocur/ocurObserved)) > alpha){
            if((positiveHistoric[i].ocur/ocurHistoric) > (negativeHistoric[j].ocur/ocurObserved)){
              newPositive.push({word:positiveHistoric[i].word,ocur:positiveHistoric[i].ocur});
            }else {
              newNegative.push({word:negativeHistoric[i].word,ocur:negativeHistoric[i].ocur});
            }
          }
          flagWordFound = true;
        }
      }
      if(!flagWordFound){
        newPositive.push({word:positiveHistoric[i].word,ocur:positiveHistoric[i].ocur});
      }
    }
    // -> <-
    for (var i = 0; i < negativeHistoric.length; i++) {
      flagWordFound = false;
      for (var j = 0; j < positiveHistoric.length; j++) {
        if(negativeHistoric[i].word == positiveHistoric[j].word){
          flagWordFound = true;
        }
      }
      if(!flagWordFound){
        newNegative.push({word:negativeHistoric[i].word,ocur:negativeHistoric[i].ocur});
      }
  }
};

//Actualiza los modelos
var updateModel = function(posModel, negModel){
  var jsonModel = {pos:posModel,neg:negModel};
  dataAccess.updateModels(jsonModel,function(response){
    if (response.success) {
        callback(response);
    }else {
      //ERROR
    }
  });
    console.log(posModel);
    console.log(" -------------------");
    console.log(negModel);
};

//Controla los procesos de generar los modelos
var genModel = function(historical,positive, negative, posModel, negModel, callback){
  filterByFrequency(historical.pos, historical.neg,0.1,positive,negative);
  posModel = mathService.percentilSum(positive,mathService.getPercentilvalue (positive,4,3));
  negModel = mathService.percentilSum(negative,mathService.getPercentilvalue (negative,4,3));

  callback(posModel, negModel);

};


//Inicia el proceso de generar el modelo
exports.startGenModel(callback){
  getHistorical(function(historical){
    var positive=[];
    var negative=[];
    var posModel = [];
    var negModel = [];

    genModel(historical,positive, negative, posModel, negModel, function(posModel, negModel){
      updateModel(posModel, negModel);
    });
  });

  //callback
}
