exports.getStopWords = function(callback) {
  callback({success: true, data: [{'word':'hehe'},{'word':'my'},{'word':'lol'}]});
};

exports.lockLearningProcess = function(callback) {
  callback({success: true});
};

exports.updateHistoricals = function(data,callback) {
  console.log(data);
  callback({'resultCode':200});
};

exports.unlockLearningProcess = function(status,callback) {
  callback({success: true});
};

exports.getHistorical = function(callback){
};

exports.updateModels = function(data,callback){
};
