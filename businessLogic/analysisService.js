'use strict'
var sentimentRepository = require('../dataAccess/sentimentRepository.js'); 
//var analysisRepository = require('../dataAccess/analysisRepository.js'); 
var utilitiesService = require('./utilitiesService.js');
var mathService = require('./mathService.js');

/*
Método para obtener aquellas palabras contenidas en 2 arreglos, la intersección de los mismos
Recibe:
      wordArray1, // [{word, occur}, ... ,  {...}]
      wordArray2  // [{word, occur}, ... ,  {...}]
Devuelve:
      newWordArray // arreglo: [{word, occur}, ... ,  {...}], intersección de ambos arreglos
*/

var wordsArrayIntersection = function(wordArray1, wordArray2){
      var newWordArray = [];
      var len_array1 = wordArray1.length, //longitud array1
            len_array2 = wordArray2.length;
      for (var i = 0; i < len_array1; i++) {
            if (len_array2 == 0) {break}// en caso de que el segundo arreglo no contenga ningún elemento
            for (var j = 0; j < len_array1; j++) {
                  if(wordArray1[i].word == wordArray2[j].word){
                        newWordArray.push(wordArray1[i]);
                        wordArray2.splice(j, 1);// Optimización: lo elimina para compararlo en la próxima iteración
                        len_array2--;
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
      for (var i = 0; i < len_array; i++) {
            freq = wordArray.occur / totalOccur;
            frequencyDistribution.push({
                                                                "word": wordArray[i].word, 
                                                                "freq": freq
                                                        });
      }
      return frequencyDistribution;

}

var getChiSquaredValue = function (freqDistExpected, freqDistObserved) {
      var x2observed = 0,
      len_array1 = freqDistObserved.length,
      len_array2 = freqDistExpected.length;

      for (var i = 0; i < len_array1; i++) {

            for (var j= 0;  j  < len_array2; j++) {
                  if (freqDistObserved[i].word == freqDistExpected[j].word) {
                        x2observed = Math.pow(freqDistObserved[i].occur + freqDistExpected[j].occur) / freqDistExpected[j].occur;
                        freqDistExpected.splice(j, 1);
                        j--;
                        break;
                  } 
              }
      }
      return x2observed;

}

var chiSquaredTest = function(fExpected, fObserved) {
      return fObserved < fExpected;
}


var getFinalDecision = function (posRes, negRes) {
      if ((posRes && negRes) || (!posRes && !negRes)){
            return 'neutral';
      } else if (posRes) {
            return 'positive';
      } else {
            return 'negative';
      } 
}


var analysisEngine = function (fExpected, modelKnowledge, stopWords, text) {
      var analysis,
            wordList, //lista de palabras a analizar, descartando stopWords
            expectedKnowledge = {}, //json: {pos:[{word, occur}], neg:[{word, occur}]}, comportamiento esperado
            observedKnowledge = {}, //json: {pos:[{word, occur}], neg:[{word, occur}]}, comportamiento observado
            negFObserved, 
            posFObserved;

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
            observedKnowledge.pos = wordsArrayIntersection(modelKnowledge.pos, analysis.occurrences);
            console.log('\n\n\n\nconsole.log(observedKnowledge.pos);');
            console.log(observedKnowledge.pos);
            observedKnowledge.neg = wordsArrayIntersection(modelKnowledge.neg, analysis.occurrences);
            console.log('\n\n\n\nconsole.log(observedKnowledge.neg);');
            console.log(observedKnowledge.neg);

            //se obtiene la colección de palabras, para cada sentimiento, que generarán la distribución de frecuencias esperados, modelos probabilíticos esperados
            expectedKnowledge.pos = wordsArrayIntersection(observedKnowledge.pos, modelKnowledge.pos);
            console.log('\n\n\n\nconsole.log(expectedKnowledge.pos);');
            console.log(expectedKnowledge.pos);
            expectedKnowledge.neg = wordsArrayIntersection(observedKnowledge.neg, modelKnowledge.neg);
            console.log('\n\n\n\nconsole.log(expectedKnowledge.neg);');
            console.log(expectedKnowledge.neg);

            //contiene la distribuciones de frecuencias esperadas de ambos sentimientos
            analysis.expectedFrequencyDistribution = {};
            //distribuciones de frecuencias esperadas, sentimiento positivo
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
            console.log('\n\n\n\nconsole.log(analysis.observedFrequencyDistribution.neg);');
            console.log(analysis.observedFrequencyDistribution.neg);
            //distribuciones de frecuencias observadas, sentimiento negativo
            analysis.observedFrequencyDistribution.neg = getFrequencyDistribution(observedKnowledge.neg);
            console.log('\n\n\n\nconsole.log(analysis.observedFrequencyDistribution.neg);');
            console.log(analysis.observedFrequencyDistribution.neg);
            
            //calcula la 'f observado'  del sentimiento positivo a partir de la distribución de frecuencias observada y esperada
            posFObserved = getChiSquaredValue(analysis.expectedFrequencyDistribution.pos, analysis.observedFrequencyDistribution.pos);
            //calcula la 'f observado'  del sentimiento negativo a partir de la distribución de frecuencias observada y esperada
            negFObserved = getChiSquaredValue(analysis.expectedFrequencyDistribution.neg, analysis.observedFrequencyDistribution.neg);

            //guarda el resultado de la pruebas de bondad de ajuste de cada sentimiento
            analysis.analysisResult = {};
            //resultado final para el sentimient positivo
            analysis.analysisResult.pos = chiSquaredTest(fExpected, posFObserved);
            //resultado final para el sentimient negativo
            analysis.analysisResult.neg = chiSquaredTest(fExpected, negFObserved);

            //obtiene la decisión final correspondiente al sentimiento del texto
            analysis.sentimient = getFinalDecision(analysis.analysisResult.pos, analysis.analysisResult.neg);

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
                                                    },
                    tableDecision  //JSON con los resultados de los análisis  individuales de cada sentimiento 
                                              {
                                                  pos, //true: el texto se comporta como texto positivo, false: el texto NO se comporta como texto positivo
                                                  neg, //true: el texto se comporta como texto negativo, false: el texto NO se comporta como texto negativo
                                              }
              }, ...., {...}],
      message //éxito: 200, fracaso:400
}
*/

exports.analyzeText  = function (data, callback){
  data = {};
      data.texts = ["buenos dias a todos mis amigos"];
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

                                fExpected = 0; //Valor por defecto para el momento en el que se implemente la recuperación de la configuración desde la base de datos
                                //proceso de evaluación
                                for (var i = 0; i < nText; i++) {
                                      analysis = analysisEngine(fExpected, modelKnowledge, stopWords, data.texts[i]);
                                      analysisArray.push(analysis);
                                      console.log('\n\n\n\nanalyzeText: console.log(analysis);');
                                      console.log(analysis);
                                }
                                /*TO DO:
                                * Guardar todos los análisis en la base de datos
                                */
                                
                                callback({
                                        success: true,
                                        data: analysisArray,
                                        message: 200
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
/*
analysisRepository.getStopWords(function (res) {
    console.log('\n\n\n\nanalysisService: getStopWords: console.log(res);');
    console.log(res);
})*/

