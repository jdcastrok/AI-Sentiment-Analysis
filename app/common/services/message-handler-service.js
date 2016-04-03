/**
 * @ngdoc Service
 * @name SAApp
  * @author Antony Durán Hernández
 * @description
 * # messageHandlerService
 * Servicio de gestión de mensajes
 */

'use strict';

angular.module('SAApp')
.factory('messageHandlerService', function (notificationService){

  return {
    notifySuccess: function(title, message){
        var delay = 7000;
        notificationService.success({message: message, title: title, delay: delay}); 
    },

    notifyInfo: function(title, message){
        var delay = 7000;
        notificationService.info({message: message, title: title, delay: delay}); 
    },

    notifyError: function(title, message) {
        var delay;
        delay = 7000;
        notificationService.error({message: message, title: title, delay: delay}); 
    },

    notifyErrorArray: function(messages) {
        var delay;
        delay = 7000;
        var len = messages.length;
        for (var i = 0; i < len; i++) {
            notificationService.error({message: messages[i],  title: null, delay: delay}); 
        }
        
    },

    notifyWarning: function(title, message){
        var delay = 7000;
        notificationService.warning({message: message, title: title, delay: delay}); 
    },

    notifyWarningArray: function(messages) {
        var delay;
        delay = 7000;
        var len = messages.length;
        for (var i = 0; i < len; i++) {
            notificationService.warning({message: messages[i], title: null, delay: delay}); 
        }
        
    }

  };
});