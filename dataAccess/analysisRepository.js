var connection = require('./connection.js');

exports.getStopWords = function(callback){
	var httpConfig = {
		//uri: 'http://ai.durancr.com:9000/sentimentAnalysis/v1/getCollection/',
		uri: 'http://localhost:9000/sentimentAnalysis/v1/getCollection/',
		method: 'GET'
	}; 
	var httpData = {
		'collection': 'stopWords'
	};
	connection.httpRequest(httpConfig, httpData, callback);
};
