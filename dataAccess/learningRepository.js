exports.getStopWords = function(callback) {
  callback([{'word':'hehe'},{'word':'my'},{'word':'lol'}]);
};

exports.createBackup = function(collections,callback) {
  callback({'resultCode':200});
};

exports.updateHistoricals = function(data,callback) {
  callback({'resultCode':200});
};

exports.restoreBackup = function(collections,callback) {
  callback({'resultCode':200});
};

exports.getHistorical = function(callback){
};

exports.updateModels = function(data,callback){
};
