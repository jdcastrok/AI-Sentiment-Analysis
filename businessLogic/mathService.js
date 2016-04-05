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
