exports.Zc95_pos = 1.96;
exports.Zc95_neg = -1.96;

//Recibe un arreglo
//Devuelve la suma total de apariciones de todas las palabras
exports.getOcurrencySum = function(array){
  var num=0;
  for (var i = 0; i < array.length; i++) {
    num+=array[i].occurrences;
  }
  return num;
};

//Recibe un arreglo de palabras, numero de percentiles para dividir,
//  numero de percentiles para tomar
//Returna el valor numerico de los percentiles tomados
exports.getPercentilValue = function(array, nPer, nPerToTake){
  var num=0;
  var limit = array.length;
  for (var i = 0; i < limit; i++) {
    num += array[i].occurrences;

  } 
 console.log('getPercentilValue: console.log(limit);');
  console.log(limit);
  console.log('getPercentilValue: console.log(num);');
  console.log(num);
  return Math.abs( (num/nPer) * nPerToTake);
};

//Recibe proporción 1, proporción 2, total 1, total 2
//Retorna un valor Z observado para la distribución X2
exports.getZobs = function(p1, p2, n1, n2){
    var obs = (p1-p2) / Math.sqrt((  (p1*(1-p1))/n1  )+(  (p2*(2-p1))/n2  ));
    return obs;
}
