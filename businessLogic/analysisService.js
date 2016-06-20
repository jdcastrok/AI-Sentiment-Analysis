'use strict'
var sentimentRepository = require('../dataAccess/sentimentRepository.js');
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

/*
Método para obtener aquellas palabras contenidas en 2 arreglos, la intersección de los mismos
Recibe:
      wordArray1, // [{word, occur}, ... ,  {...}]
      wordArray2  // [{word, occur}, ... ,  {...}]
Devuelve:
      newWordArray // arreglo: [{word, occur}, ... ,  {...}], intersección de ambos arreglos //CON EL NUMERO DE APARICIONES DEL PRIMER ARREGLO
*/

var wordsArrayIntersection = function(wordArray1, wordArray2){
      //console.log("iniciando | model: " + require('util').inspect(wordArray1, { depth: null }) + " | occurrences: " + require('util').inspect(wordArray2, { depth: null }));
      var newWordArray = [];
      var len_array1 = wordArray1.length, //longitud array1
            len_array2 = wordArray2.length,
            coincidences = 0;
      //console.log("len model: " + len_array1 + " | len occurrences: " + len_array2);
      for (var i = 0; i < len_array1; i++) {
            if (coincidences == len_array2) {break}// en caso de que el segundo arreglo no contenga ningún elemento
            for (var j = 0; j < len_array2; j++) {
                  //console.log("1: " + require('util').inspect(wordArray1[i], { depth: null }));
                  //console.log("2: " + require('util').inspect(wordArray2[j], { depth: null }));
                  if(wordArray1[i].word == wordArray2[j].word){
                        //console.log("coincidencia: " + wordArray2[j].word);
                        newWordArray.push(wordArray1[i]);
                        //wordArray2.splice(j, 1);// Optimización: lo elimina para compararlo en la próxima iteración
                        //len_array2--;
                        break;
                  }
            }
      }
      return newWordArray;
}

/*
Método para obtener la distribución de frecuencias de una colección de palabras, modelo probabilístico
Recibe:
      wordArray // colección de palabras: [{word, occur}, ... ,  {...}]
Devuelve:
      frequencyDistribution // distribución de frecuencias: [{word, freq}, ... ,  {...}], modelo probabilístico
*/
var getFrequencyDistribution = function (wordArray) {
      var totalOccur,
            freq,
            len_array,
            frequencyDistribution;

      frequencyDistribution = [];
      len_array = wordArray.length;
      totalOccur = mathService.getOcurrencySum(wordArray);
      //console.log("\n---------------\nlen: " + len_array + " | total: " + totalOccur);
      for (var i = 0; i < len_array; i++) {
            freq = wordArray[i].occur / totalOccur;
            //console.log(freq);
            frequencyDistribution.push({
                                                                "word": wordArray[i].word,
                                                                "freq": freq
                                                        });
      }
      //var v = mathService.getOcurrencySum(frequencyDistribution);
      //console.log(v);
      //console.log(require('util').inspect(frequencyDistribution, { depth: null }));
      return frequencyDistribution;

}

var getChiSquaredValue = function (freqDistExpected, freqDistObserved) {
      var x2observed = null,
      len_array1 = freqDistExpected.length,
      len_array2 = freqDistObserved.length;

      //console.log("len1 : " + len_array1 + " | len2 : " + len_array2);
      //console.log(require('util').inspect(freqDistExpected, { depth: null }));
      //console.log(require('util').inspect(freqDistObserved, { depth: null }));

      for (var i = 0; i < len_array1; i++) {
        for (var j = 0; j < len_array2; j++) {
          if (freqDistExpected[i].word == freqDistObserved[j].word) {
            //console.log("\n\n---------------\nf0 : " + freqDistObserved[j].freq);
            //console.log("fe : " + freqDistExpected[j].freq);
            //console.log("(f0 - fe)^2 : " + Math.pow(freqDistObserved[j].freq - freqDistExpected[i].freq, 2));
            //console.log("(f0 - fe)^2 / fe : " + (Math.pow(freqDistObserved[j].freq - freqDistExpected[i].freq, 2) / freqDistExpected[i].freq));

            x2observed += Math.pow(freqDistObserved[j].freq - freqDistExpected[i].freq, 2) / freqDistExpected[i].freq;
          }
        }
      }

      /*for (var i = 0; i < len_array1; i++) {

            for (var j= 0;  j  < len_array2; j++) {
                  if (freqDistObserved[i].word == freqDistExpected[j].word) {
                        x2observed = Math.pow(freqDistObserved[i].occur + freqDistExpected[j].occur) / freqDistExpected[j].occur;
                        freqDistExpected.splice(j, 1);
                        j--;
                        break;
                  }
              }
      }*/
      return x2observed;

}

var chiSquaredTest = function(fExpected, fObserved) {
      if (!fObserved) {
        return false;
      }
      return fObserved < fExpected;
}


var getFinalDecision = function (posRes, negRes) {
      if ((posRes && negRes) || (!posRes && !negRes)){
            return 'Neutral';
      } else if (posRes) {
            return 'Positive';
      } else {
            return 'Negative';
      }
}


var analysisEngine = function (fExpected, modelKnowledge, stopWords, text) {
      var analysis,
            wordList, //lista de palabras a analizar, descartando stopWords
            expectedKnowledge = {}, //json: {pos:[{word, occur}], neg:[{word, occur}]}, comportamiento esperado
            observedKnowledge = {}, //json: {pos:[{word, occur}], neg:[{word, occur}]}, comportamiento observado
            negFObserved,
            posFObserved;
            //testeo
            var positiveModel = modelKnowledge.pos;
            var negativeModel = modelKnowledge.neg;

            //almacenará el análisis en su completitud
            analysis = {};
            //texto a analizar
            analysis.text =  text;

            //se crea la lista de todas las palabras presentes en el texto
            wordList = utilitiesService.tokenize(analysis.text);
            //remueve las palabras que no son de de interés para el análisis
            wordList = utilitiesService.removeStopWords(wordList, stopWords);
            //se agrupan por palabra acumulando su número de apariciones
            analysis.occurrences = utilitiesService.groupByOccurrences(wordList);
            console.log('\n\n\n\nanalysisEngine: console.log(analysis.occurrences);');
            console.log(analysis.occurrences);
            //se obtiene la colección de palabras, para cada sentimiento, que generarán la distribución de frecuencias observadas, modelos probabilíticos observados
            //console.log(modelKnowledge.pos.length);
            /*  El modelo observado debería ser, las palabras comunes con las apariciones del texto  */
            //ORIGINAL observedKnowledge.pos = wordsArrayIntersection(positiveModel, analysis.occurrences);
            observedKnowledge.pos = wordsArrayIntersection(analysis.occurrences, positiveModel);
            console.log('\n\n\n\nconsole.log(observedKnowledge.pos);');
            console.log(observedKnowledge.pos);
            observedKnowledge.neg = wordsArrayIntersection(analysis.occurrences, negativeModel);
            console.log('\n\n\n\nconsole.log(observedKnowledge.neg);');
            console.log(observedKnowledge.neg);

            //se obtiene la colección de palabras, para cada sentimiento, que generarán la distribución de frecuencias esperados, modelos probabilíticos esperados
            //console.log(modelKnowledge.pos.length);
            /*  El modelo esperado debería ser las palabras comunes con las apariciones de la colección modelo  */
            expectedKnowledge.pos = wordsArrayIntersection(positiveModel, observedKnowledge.pos);
            //console.log(modelKnowledge.pos.length);
            console.log('\n\n\n\nconsole.log(expectedKnowledge.pos);');
            console.log(expectedKnowledge.pos);
            expectedKnowledge.neg = wordsArrayIntersection(negativeModel, observedKnowledge.neg);
            console.log('\n\n\n\nconsole.log(expectedKnowledge.neg);');
            console.log(expectedKnowledge.neg);

            //contiene la distribuciones de frecuencias esperadas de ambos sentimientos
            analysis.expectedFrequencyDistribution = {};
            //distribuciones de frecuencias esperadas, sentimiento positivo
            //console.log("por aqui voy");
            analysis.expectedFrequencyDistribution.pos = getFrequencyDistribution(expectedKnowledge.pos);
            console.log('\n\n\n\nconsole.log(analysis.expectedFrequencyDistribution.pos);');
            console.log(analysis.expectedFrequencyDistribution.pos);
            //distribuciones de frecuencias esperadas, sentimiento negativo
            analysis.expectedFrequencyDistribution.neg = getFrequencyDistribution(expectedKnowledge.neg);
            console.log('\n\n\n\nconsole.log(analysis.expectedFrequencyDistribution.neg);');
            console.log(analysis.expectedFrequencyDistribution.neg);

            //contiene la distribuciones de frecuencias observadas de ambos sentimientos
            analysis.observedFrequencyDistribution = {};
            //distribuciones de frecuencias observadas, sentimiento positivo
            analysis.observedFrequencyDistribution.pos = getFrequencyDistribution(observedKnowledge.pos);
            console.log('\n\n\n\nconsole.log(analysis.observedFrequencyDistribution.pos);');
            console.log(analysis.observedFrequencyDistribution.pos);
            //distribuciones de frecuencias observadas, sentimiento negativo
            analysis.observedFrequencyDistribution.neg = getFrequencyDistribution(observedKnowledge.neg);
            console.log('\n\n\n\nconsole.log(analysis.observedFrequencyDistribution.neg);');
            console.log(analysis.observedFrequencyDistribution.neg);

            //calcula la 'f observado'  del sentimiento positivo a partir de la distribución de frecuencias observada y esperada
            posFObserved = getChiSquaredValue(analysis.expectedFrequencyDistribution.pos, analysis.observedFrequencyDistribution.pos);
            console.log("posFObs: " + posFObserved);
            //calcula la 'f observado'  del sentimiento negativo a partir de la distribución de frecuencias observada y esperada
            negFObserved = getChiSquaredValue(analysis.expectedFrequencyDistribution.neg, analysis.observedFrequencyDistribution.neg);
            console.log("negFObs: " + negFObserved);

            //guarda el resultado de la pruebas de bondad de ajuste de cada sentimiento
            analysis.analysisResult = {};
            //resultado final para el sentimient positivo
            analysis.analysisResult.pos = chiSquaredTest(fExpected, posFObserved);
            //resultado final para el sentimient negativo
            analysis.analysisResult.neg = chiSquaredTest(fExpected, negFObserved);

            //obtiene la decisión final correspondiente al sentimiento del texto
            analysis.sentiment = getFinalDecision(analysis.analysisResult.pos, analysis.analysisResult.neg);

            //retorna el análisis completo
            return analysis;
}


/*
Método para analizar una serie de textos dados de acuerdo a los parámetros especificados
Recibe:
data:{
      alpha,            //nivel de significancia
      kCategories, //número de categoría que se utilizaron durante la generación de las colecciones modelo (valor guardado en la base de datos)
      texts             //array de textos a analizar con la configuración anterior
}
callback              //para devolver la respuesta

Devuelve:
res:{
      success,        //éxito: true, fracaso: false
      data               //exito:  array con los resultados de los análisis de cada texto
              [{
                    sentiment,  // 'positive', 'negative', 'neutral'
                    analysisResult //guarda los resultados de las pruebas de chi-cuadrado
                                          {
                                                pos, //true: texto se comporta como positivo, false: texto NO se comporta como positivo
                                                neg  //true: texto se comporta como negativo, false: texto NO se comporta como negativo
                                          },
                    alpha,          // nivel de significancia utilizado en el análisis,
                    kCategories, //número de categoría que se utilizaron durante la generación de las colecciones modelo (valor guardado en la base de datos)
                    text,             // String del texto analizado
                    occurrences, //array de objetos json ({'word', ''occur'}) con la palabra y su número de apariciones en el texto
                    expectedFrequencyDistribution  //JSON con distribución de frecuencias esperadas de cada sentimiento
                                                    {
                                                        pos, //array de distribución de frecuencias de palabras positivas en el texto: [{word, freq}, ... , {word, freq}]
                                                        neg, //array de distribución de frecuencias de palabras negativas en el texto: [{word, freq}, ... , {word, freq}]
                                                    },
                    observedFrequencyDistribution  //JSON con distribución de frecuencias esperadas de cada sentimiento
                                                    {
                                                        pos, //array de distribución de frecuencias de palabras positivas en el texto: [{word, freq}, ... , {word, freq}]
                                                        neg, //array de distribución de frecuencias de palabras negativas en el texto: [{word, freq}, ... , {word, freq}]
                                                    }
              }, ...., {...}],
      message //éxito: 200, fracaso:400
}
*/


exports.analyzeText  = function (data, nPer, nPerToTake, alpha, callback){
  //data = {};
      //data.texts = ["life earth millions","out breakup apologize","life earth millions out breakup apologize"];
      sentimentRepository.getStopWords(function (res) {
            if (res.success) {
              var stopWords = res.data;
                    sentimentRepository.getKnowledgeDB('Model', function (res) {
                          if (res.success) {
                                /* TO DO: A futuro
                                *
                                *   Hacer que recupere el 'f esperado' de la base de datos, de acuerdo con el alpha especificado,
                                *   y el número 'k' de categorías usadas  en el aprendizaje
                                *   (este último valor puede estar almacenada en una colección de configuración en la base de datos)
                                */
                                var modelKnowledge = res.data,
                                nText = data.texts.length,//guarda el número de textos que se van a analizar  (longitud del array)
                                analysisArray = [],
                                analysis,
                                fExpected; //se calcula con el alpha y k de categorías usadas en el aprendizaje

                                fExpected = 7.815; //v = 3, alfa = 0.05 -> desde la tabla x2 //Valor por defecto para el momento en el que se implemente la recuperación de la configuración desde la base de datos
                                //proceso de evaluación
                                for (var i = 0; i < nText; i++) {
                                      //console.log(require('util').inspect(modelKnowledge, { depth: null }));
                                      //console.log("model len: " + modelKnowledge.length);
                                      analysis = analysisEngine(fExpected, modelKnowledge, stopWords, data.texts[i]);
                                      analysis.alpha = alpha;
                                      analysis.kCategories = nPerToTake;
                                      analysisArray.push(analysis);
                                      console.log('\n\n\n\nanalyzeText: console.log(analysis);');
                                      console.log(analysis);
                                }
                                /*TO DO:
                                * Guardar todos los análisis en la base de datos
                                */

                                //se obtienen las palabras por aprender actuales
                                sentimentRepository.getLearningQueue(function (response) {
                                  if (response.success) {
                                    //console.log(require('util').inspect(response.data, { depth: null }));
                                    var learningQueue = response.data;

                                    //se agregan las nuevas
                                    for (var i = 0; i < analysisArray.length; i++) {
                                      //console.log(require('util').inspect(analysisArray, { depth: null }));
                                      if (analysisArray[i].sentiment == 'Neutral') {
                                        continue;
                                      } else if (analysisArray[i].sentiment == 'Positive') {
                                        learningQueue.push({"sent" : "pos", "words" : analysisArray[i].occurrences});
                                      } else if (analysisArray[i].sentiment == 'Negative') {
                                        learningQueue.push({"sent" : "neg", "words" : analysisArray[i].occurrences});
                                      } else {
                                        //???
                                      }
                                    }

                                    //console.log(require('util').inspect(learningQueue, { depth: null }));
                                    //return;
                                    //se insertan a la base de datos
                                    sentimentRepository.updateLearningQueue(learningQueue, function (response) {
                                      if (response.success) {
                                        console.log("success learningQueue");//return;
                                        //se insertan las estadisticas en la base de datos
                                        sentimentRepository.getAnalisysStatistics(function (response) {
                                          if (response.success) {
                                            console.log("success get stats");
                                            //bien
                                            //concateno los análisis existentes con los nuevos
                                            var analysisStatistics = response.data;

                                            for (var i = 0; i < analysisArray.length; i++) {
                                              analysisStatistics.push(analysisArray[i]);
                                            }

                                            sentimentRepository.updateAnalisysStatistics(analysisStatistics, function () {
                                              if (response.success) {
                                                console.log("success insert stats");
                                                callback({
                                                        success: true,
                                                        data: analysisArray,
                                                        message: 200
                                                });
                                              } else {
                                                callback(response);
                                              }
                                            });
                                          } else {
                                            //error
                                            callback(response);
                                          }
                                        });
                                      }
                                    });
                                  } else {
                                    callback(response);
                                  }
                                });

                          } else {
                                callback(res);
                          }
                    });
            } else {
                    callback(res);
            }
      });
};

//exports.analyzeText({"texts" : ["life earth millions","out breakup apologize","life earth millions out breakup apologize"]}, 4, 3, 0.05, function (response) {
//  console.log(require('util').inspect(response, { depth: null }));
//});
