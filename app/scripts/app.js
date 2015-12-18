'use strict';

/**
 * @ngdoc overview
 * @name tiPortal3App
 * @description
 * # tiPortal3App
 *
 * Main module of the application.
 */
angular
  .module('tiPortal3App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'adf',
    'adf.structures.base',
    'adf.widget.clock',
    'adf.widget.Graph',
    'ui.codemirror',
    'uiGmapgoogle-maps',
    'chart.js',
    'ngFileSaver',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
