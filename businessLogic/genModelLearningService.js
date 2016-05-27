'use strict'

var dataAccess = require('../dataAccess/learningRepository.js');
var mathService = require('./mathService.js');
/*
Recibe las colecciones historicas
{
  pos,    //arreglo de palabras positivas con su respectivo N° de apariciones
  neg     //arreglo de palabras positivas con su respectivo N° de apariciones
}
Devuelve colecciones modelo. Aquellas palabras mutuamente excluyentes
{
  pos,    //arreglo de palabras positivas con su respectivo N° de apariciones
  neg     //arreglo de palabras positivas con su respectivo N° de apariciones
}
*/
var filterByFrequency = function(historicalKnowledge){
      var totalPositiveHistoricalOccurrences,
            totalNegativeHistoricalOccurrences,
            positiveProportion,
            negativeProportion,
            Zobs;

      totalPositiveHistoricalOccurrences = mathService.getOcurrencySum(historicalKnowledge.pos);
      totalNegativeHistoricalOccurrences = mathService.getOcurrencySum(historicalKnowledge.neg);
      for (var i = 0; i < historicalKnowledge.pos.length; i++) {

              for (var j = 0; j < historicalKnowledge.neg.length; j++) {
                    if(historicalKnowledge.pos[i].word == historicalKnowledge.neg[j].word){
                          //console.log(historicalKnowledge.pos[i].word);
                          positiveProportion = historicalKnowledge.pos[i].occur / totalPositiveHistoricalOccurrences;
                          negativeProportion = historicalKnowledge.neg[j].occur / totalNegativeHistoricalOccurrences;
                          //console.log('filterByFrequency: console.log(positiveProportion);');
                          //console.log(positiveProportion);
                          //console.log('filterByFrequency: console.log(negativeProportion);');
                          //console.log(negativeProportion);

                          Zobs = mathService.getZobs(positiveProportion, negativeProportion, totalPositiveHistoricalOccurrences, totalNegativeHistoricalOccurrences);

                          if(Zobs<mathService.Zc95_neg || Zobs>mathService.Zc95_pos){

                                  if((positiveProportion) > (negativeProportion)){
                                        historicalKnowledge.neg.splice(j, 1); //se elimina el elemento
                                        j--;
                                  }else {
                                        historicalKnowledge.pos.splice(i, 1); //se elimina el elemento
                                        i--;
                                  }
                          }else{
                                  historicalKnowledge.neg.splice(j, 1); //se elimina el elemento
                                  historicalKnowledge.pos.splice(i, 1); //se elimina el elemento
                                  i--;
                                  j--;
                          }
                          break;
                    }
              }
      }

    return historicalKnowledge; //conocimiento histórico transformado a modelo
};


//Recibe un arreglo ordenado decendentemente y un número máximo de ocurrencias
//Devuelve un arreglo con las palabras más representativas
var getMostRepresentativeWords = function(wordsArray, maxOccurrences){
      var representativeWords=[];
      var sumOccurrences = 0;
      var i = 0;
      while (sumOccurrences<=maxOccurrences){
              //console.log('getMostRepresentativeWords: while: console.log(wordsArray[i]);');
              //console.log(wordsArray[i]);

              representativeWords.push(wordsArray[i]);

              //console.log('getMostRepresentativeWords: while: console.log(representativeWords);');
              //console.log(representativeWords);

              sumOccurrences += wordsArray[i].occur;
              i++;
      }
      return representativeWords;
};


/*Genera las colleciones modelo a partir de una histórica, para ambos sentimientos: positivo, negativo
Recibe las colecciones historicas
{
  pos,    //arreglo de palabras positivas con su respectivo N° de apariciones
  neg     //arreglo de palabras positivas con su respectivo N° de apariciones
}
Devuelve colecciones modelo. Aquellas palabras más representativas y mutuamente excluyentes
{
  pos,    //arreglo de palabras positivas con su respectivo N° de apariciones
  neg     //arreglo de palabras positivas con su respectivo N° de apariciones
}
*/
exports.generateModel = function(historicalKnowledge, nPer,nPerToTake,  callback){

  console.log("\n"+ nPer +' - '+nPerToTake+"\n");
  console.log("14.Inside -> generateModel");
      //console.log("unsorted Historical\n\n");
      //console.log(require('util').inspect(historicalKnowledge, { depth: null }));
      //console.log("\n\n_______________________\n\n");

      historicalKnowledge.pos = mathService.sortCollection(historicalKnowledge.pos);
      historicalKnowledge.neg = mathService.sortCollection(historicalKnowledge.neg);

      //console.log("unsorted Historical\n\n");
      //console.log(require('util').inspect(historicalKnowledge, { depth: null }));
      //console.log("\n\n_______________________\n\n");

      var modelKnowledge = {
                                                      "pos": [],
                                                      "neg": []
                                                };
      var percentilValuePos = mathService.getPercentilValue (historicalKnowledge.pos, nPer, nPerToTake);                                                 //máximo de ocurrencias para de la colección positiva
      //console.log('console.log(maxOccur);');
      //console.log(maxOccur);
      modelKnowledge.pos = getMostRepresentativeWords(historicalKnowledge.pos, percentilValuePos.abs);//recupera palabras más representativas
      //console.log('console.log(modelKnowledge.pos);');
      //console.log(modelKnowledge.pos);

      var percentilValueNeg = mathService.getPercentilValue (historicalKnowledge.neg, nPer, nPerToTake)                                                   //máximo de ocurrencias para de la colección negativa
      //console.log('console.log(maxOccur);');
      //console.log(maxOccur);
      modelKnowledge.neg = getMostRepresentativeWords(historicalKnowledge.neg, percentilValueNeg.abs);//recupera palabras más representativas
      //console.log('console.log(modelKnowledge.neg);');
      //console.log(modelKnowledge.neg);

      modelKnowledge = filterByFrequency(modelKnowledge);
                         //discrimina aquellas que se repitan y tengan una frecuencia "igual"

      /////////LOGS
      modelKnowledge.limitNeg = percentilValueNeg.limit;
      modelKnowledge.limitPos = percentilValuePos.limit;
      modelKnowledge.numNeg = percentilValueNeg.num;
      modelKnowledge.numPos = percentilValuePos.num;
      modelKnowledge.nPer = nPer;
      modelKnowledge.nPerToTake = nPerToTake;
      /////////////

      //console.log(modelKnowledge);

      callback({"success" : true, "data" : modelKnowledge, "status" : 200});
};
