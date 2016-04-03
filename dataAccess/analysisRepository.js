var connection = require('./connection.js');

exports.getOneMethod = function(data, callback){
	callback({prueba: 'exitosa'});
	return;
	var queryParams = {
		query: {},
		collection: 'collectionName'
	};
	dbConnection.findOneDocument(
		queryParams, 
		function(res){
			callback(res);
		}
	);
};