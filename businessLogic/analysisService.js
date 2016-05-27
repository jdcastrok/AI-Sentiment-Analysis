'use strict'
var sentimentRepository = require('../dataAccess/sentimentRepository.js');
var utilitiesService = require('./utilitiesService.js');

/*
Método para analizar una serie de textos dados de acuerdo a los parámetros especificados
Recibe:
data:{
      alpha,            //nivel de significancia
      kCategories, //número de categoría que se utilizaron durante la generación de las colecciones modelo (valor guardado en la base de datos)
      textos            //array de textos a analizar con la configuración anterior
}
callback              //para devolver la respuesta
Devuelve:
res:{
      success,        //éxito: true, fracaso: false
      data               //exito:  array con los resultados de los análisis de cada texto
              {
                    sentiment,  // 'positive', 'negative', 'neutral'
                    alpha,          // nivel de significancia utilizado en el análisis
                    text,             // String del texto analizado
                    expectedFrequencyDistribution  //JSON con distribución de frecuencias esperadas de cada sentimiento
                                                    {
                                                        pos, //array de distribución de frecuencias de palabras positivas en el texto: [{word, freq}, ... , {word, freq}]
                                                        neg, //array de distribución de frecuencias de palabras negativas en el texto: [{word, freq}, ... , {word, freq}]
                                                    },
                    observedFrequencyDistribution  //JSON con distribución de frecuencias esperadas de cada sentimiento
                                                    {
                                                        pos, //array de distribución de frecuencias de palabras positivas en el texto: [{word, freq}, ... , {word, freq}]
                                                        neg, //array de distribución de frecuencias de palabras negativas en el texto: [{word, freq}, ... , {word, freq}]
                                                    },
                    tableDecision  //JSON con los resultados de los análisis  individuales de cada sentimiento
                                              {
                                                  pos, //true: el texto se comporta como texto positivo, false: el texto NO se comporta como texto positivo
                                                  neg, //true: el texto se comporta como texto negativo, false: el texto NO se comporta como texto negativo
                                              }
              },
      message //éxito: 200, fracaso:400
}
*/

exports.analyzeText = function(data, callback){
  sentimentRepository.getStopWords(function (res) {
    if (res.success) {
      var stopWords = res.data;
      sentimentRepository.getKnowledgeDB('Model', function (res) {
        if (res.success) {
          var modelKnowledge = res.data;
          //proceso de evaluación
          // ...

          //console.log(require('util').inspect(modelKnowledge, { depth: null }));

          for (var i = 0; i < data.texts.length; i++) {
            var wordOccurrences = utilitiesService.groupByOccurrences(utilitiesService.removeStopWords(utilitiesService.tokenize(data.texts[i].text),stopWords));

            var observedCollections = generateObserved(wordOccurrences, modelKnowledge);
            var expectedCollections = generateExpected(wordOccurrences, modelKnowledge);

            console.log(require('util').inspect(observedCollections, { depth: null }));
            console.log(require('util').inspect(expectedCollections, { depth: null }));
          }
        } else {
          callback(res);
        }
      });
    } else {
      callback(res);
    }
  });
};

function generateObserved(wordOccurrences, modelKnowledge) {
  /*
    tengo una lista de palabras encontradas en el texto y su respectivo numero de apariciones,
    tengo un modelo de palabras positivas,
    tengo un modelo de palabras negativas,
    por cada una de esas palabras,
      si la palabra se encuentra en el modelo positivo,
        agrego a palabras observadas positivas
      si se encuentra en el modelo negativo,
        agrego a palabras negativas
      si no,
        continúo
    retorno ambas listas de palabras observadas
  */
  var observedCollections = {"pos" : [] , "neg" : []};

  var positiveModel = [];
  var negativeModel = [];

  for (var i = 0; i < modelKnowledge.pos.length; i++) {
    positiveModel.push(modelKnowledge.pos[i].word);
  }

  for (var i = 0; i < modelKnowledge.neg.length; i++) {
    negativeModel.push(modelKnowledge.neg[i].word);
  }

  for (var i = 0; i < wordOccurrences.length; i++) {
    if (positiveModel.indexOf(wordOccurrences[i].word) > -1) {
      observedCollections.pos.push(wordOccurrences[i]);
    } else if (negativeModel.indexOf(wordOccurrences[i].word) > -1) {
      observedCollections.neg.push(wordOccurrences[i]);
    }
  }

  return observedCollections
}

function generateExpected(wordOccurrences, modelKnowledge) {
  /*
    tengo una lista de palabras encontradas en el texto y su respectivo numero de apariciones,
    tengo un modelo de palabras positivas,
    tengo un modelo de palabras negativas,
    por cada palabra del modelo positivo,
      si la palabra se encuentra en el texto,
        agrego a palabras esperadas positivas
      si no,
        continúo
    por cada palabra del modelo negativo,
      si se encuentra en el texto,
        agrego a palabras negativas
      si no,
        continúo
    retorno ambas listas de palabras esperadas
  */
  var expectedCollections = {"pos" : [] , "neg" : []};

  var textWords = [];

  for (var i = 0; i < wordOccurrences.length; i++) {
    textWords.push(wordOccurrences[i].word);
  }

  for (var i = 0; i < modelKnowledge.pos.length; i++) {
    if (textWords.indexOf(modelKnowledge.pos[i].word) > -1) {
      expectedCollections.pos.push(modelKnowledge.pos[i]);
    }
  }

  for (var i = 0; i < modelKnowledge.neg.length; i++) {
    if (textWords.indexOf(modelKnowledge.neg[i].word) > -1) {
      expectedCollections.neg.push(modelKnowledge.neg[i]);
    }
  }

  return expectedCollections
}
