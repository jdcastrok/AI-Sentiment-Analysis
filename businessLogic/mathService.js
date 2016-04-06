exports.Zc95_pos = 1.96;
exports.Zc95_neg = -1.96;

exports.updateModels = function(callback) {
  callback({'resultCode':200});
}

//Recibe un arreglo
//Devuelve la suma total de apariciones de todas las palabras
exports.getOcurrency = function(array){
  var num=0;
  for (var i = 0; i < array.length; i++) {
    num+=array[i].ocur;
  }
  return num;
};

//Recibe un arreglo de palabras, numero de percentiles para dividir,
//  numero de percentiles para tomar
//Returna el valor numerico de los percentiles tomados
exports.getPercentilvalue = function(array,nPer,nPerToTake){
  var num=0;
  for (var i = 0; i < array.length; i++) {
    num+=array[i].ocur;
  }
  return Math.abs(num/nPer*nPerToTake);
};

//Recibe proporción 1, proporción 2, total 1, total 2
//Retorna un valor Z observado para la distribución X2
exports.zObs = function(p1, p2, n1, n2){
    var obs = (p1-p2) / Math.sqrt((  (p1*(1-p1))/n1  )+(  (p2*(2-p1))/n2  ));
    return obs;
}

//Recibe un arreglo ordenado decendente y un numero num
//Devuelve un modelo
exports.percentilSum = function(array,num){
  var newArray=[];
  var sum = 0;
  var i = 0;
  do{
    newArray.push(array[i]);
    sum += array[i].ocur;
    i++;
  }while (sum<=num);
  return newArray;
};
