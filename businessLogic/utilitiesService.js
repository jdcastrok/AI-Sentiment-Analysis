//recibe un texto y retorna una lista con todas sus palabras
exports.tokenize = function(text) {
  var Tokenizer = require('tokenize-text');
  var tokenizer = new Tokenizer();

  var tokens = tokenizer.words()(text);
  var words = [];

  var j = 0;
  for (var i = 0; i < tokens.length; i++) {
    var word = tokens[i].value.toLowerCase();
    //if (isStopWord(word)) { //verfica si la palabra es un StopWord
    //  continue;
    //}
    words[j] = word;
    j++;
  }

  return words;
}

exports.removeStopWords = function(words, stopWords) {
  for (var i = 0; i < words.length; i++) {
    if (isStopWord(words[i], stopWords)) {
      words.splice(i,1);
      i--;
    }
  }
  return words;
}

//recibe una palabra y determina si es un StopWord
function isStopWord(word, stopWords) {
  for (var i = 0; i < stopWords.length; i++) {
    if (word == stopWords[i].word) {
      return true;
    }
  }
  return false;
}

//agrupa una lista de palabras en base a su apariciones
exports.groupByOcurrences = function(words) {
  var groupedWords = [];

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var j = 0;
    for (j; j < groupedWords.length; j++) {
      if (groupedWords[j].word == word) {
        groupedWords[j].ocur += 1;
        break;
      }
    }
    if (j == groupedWords.length) {
      groupedWords[j] = {'word' : word, 'ocur' : 1};
    }
  }

  return groupedWords;
}

exports.groupBySentiment = function(currentWords, wordsToAdd) {
  for (var i = 0; i < wordsToAdd.length; i++) {
    var word = wordsToAdd[i];
    var j = 0;
    for (j; j < currentWords.length; j++) {
      if (currentWords[j].word == word.word) {
        currentWords[j].ocur += word.ocur;
        break;
      }
    }
    if (j == currentWords.length) {
      currentWords[j] = {'word' : word.word, 'ocur' : word.ocur};
    }
  }

  return currentWords;
}
