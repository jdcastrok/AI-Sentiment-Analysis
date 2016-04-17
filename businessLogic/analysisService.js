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

exports.analyzeText(data, callback){
      sentimentRepository.getStopWords(function (res) {
            if (res.success) {
              var stopWords = res.data;
                    sentimentRepository.getKnowledgeDB('Model', function (res) {
                          if (res.success) {
                                  var modelKnowledge = res.data;
                                  //proceso de evaluación
                                  // ...
                          } else {
                                callback(res);
                          }
                    });
            } else {
                    callback(res);
            }
      });
};