'use strict';

/**
 * @ngdoc 
 * @name SAApp
 * @description
 * # Sentiment Analysis application
 *
 * Main module of the application.
 */
angular
  .module('SAApp', [
    'ui.router',
    'ui-notification'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/sentiment-analysis', '/analyze');
    $urlRouterProvider.otherwise('/analyze');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'common/views/base.html'
      })
          .state('analyze', {
            url: '/analyze',
            parent: 'base',
            templateUrl: 'analysis/views/analysis.html'
          });
  });
