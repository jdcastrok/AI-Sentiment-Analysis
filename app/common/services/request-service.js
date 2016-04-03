/**
 * @ngdoc Service
 * @name SAApp
  * @author Antony Durán Hernández
 * @description
 * # requestService
 * Servicio de gestión de solicitudes http
 */

'use strict';

angular.module('SAApp')
.factory('requestService', function ($http) {

    return {
      request: function (data, configs) {
        /*
        input params: 
          data:{
                params,
                data //data to be sent
          }
          configs:{
            method, //GET, POST, PUT, DELETE
            url
          }
        */
        return $http(
          {
            method: configs.method,
            url: configs.url + data.params,
            data: data.data
          }
        ).then(
            function(response) {
              return response.data;
            }, 
            function errorCallback(response) {
              return response.data;
            }
          );
        }

    };
});
