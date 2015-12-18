'use strict';

angular.module('adf.widget.Graph', ['adf.provider', ])

.config(function(dashboardProvider) {
  dashboardProvider
    .widget('Graph', {
      title: 'Graph',
      description: 'It shows a graph',
      templateUrl: '{widgetsPath}/scripts/services/view.html',
      reload: true,
      controller: 'GraphCtrl',
      resolve: {
        data: function(config, $http, $q, $rootScope) {

          if (!$rootScope.parameters) {
            $rootScope.parameters = {};
          }

          var deferred = $q.defer();
          if (config.cache) {
            setTimeout(function() {
              deferred.resolve(config.data);
            }, 500);
            return deferred.promise;
          }

          var token = $rootScope.token;
          $http.defaults.headers.common.Authorization = "Token " + token;
          var json = "application/json";
          $http.defaults.headers.common.Accept = json;
          $http.defaults.headers.common["Content-Type"] = json;

          var url = config.url;
          var param = config.param;
          var totalUrl = url + param;

          $http.get(totalUrl).success(function(data) {
            deferred.resolve(data);
          }).error(function() {
            deferred.reject();
          });

          return deferred.promise;
        }
      },
      edit: {
        templateUrl: '{widgetsPath}/scripts/services/edit.html',
        controller: 'EditGraphCtrl',
      }
    });
})

//ViewController
.controller('GraphCtrl', function($scope, data, config) {

  if (data) {
    $scope.chartType = config.chartType;

    if (config.chartType == "Table") {
      $scope.header = eval(config.headerFormula);
      $scope.data = eval(config.dataFormula);
    }
    if (config.chartType == "Text") {
      $scope.data = JSON.stringify(data, null, ' ');
    }

    if (['Bar', 'Line', 'Pie', 'Doughnut', 'Radar', 'Polar'].indexOf(config.chartType) != -1) {
      $scope.labels = eval(config.labelsFormula);
      $scope.data = eval(config.dataFormula);
    }

    if (['GoogleMap'].indexOf(config.chartType) != -1) {
      $scope.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: parseInt(config.scale)
      };
      $scope.points = eval(config.pointsFormula);
      $scope.routes = eval(config.routesFormula);
    }
  }
})

//Editor Controller
.controller('EditGraphCtrl', function($scope, $http, config, $rootScope) {

  $scope.jsedit = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'javascript'
  };

  $scope.sqledit = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'sql',
  };

  $scope.webservices = [{
    "url": "",
    "Description": "Custom Web Service",
    "parameters": ""
  },{
    "url": "api/search_by_search_period",
    "Description": "Search hits by look date API",
    "parameters": "market+ptype+period+onds"
  }, {
    "page": "search-look-hits.html",
    "url": "api/v1/search_look_hits",
    "Description": "Search hits by look date API",
    "parameters": "market+month+origin+destination"
  }, {
    "page": "search-travel-hits.html",
    "url": "api/v1/search_travel_hits",
    "Description": "Search hits by travel date API  ",
    "parameters": "market+month+origin+destination+weekends"
  }, {
    "page": "search-hit-evolutions.html",
    "url": "api/v1/search_hit_evolutions",
    "Description": "Search hit evolutions API",
    "parameters": "market+origin+destination"
  }, {
    "page": "search-hit-variations.html",
    "url": "api/v1/search_hit_variations",
    "Description": "Search hit variations API  ",
    "parameters": "market+month_a+month_b"
  }, {
    "page": "booking-analysis-evolution.html",
    "url": "api/v1/booking_agency_evolutions",
    "Description": "Travel Agency Booking Analysis API - evolution  ",
    "parameters": "booking_period"
  }, {
    "page": "booking-analysis-top-airlines.html",
    "url": "api/v1/booking_agency_airlines",
    "Description": "Travel Agency Booking Analysis API - top airlines",
    "parameters": "booking_period+sort_by"
  }, {
    "page": "booking-analysis-top-countries.html",
    "url": "api/v1/booking_agency_countries",
    "Description": "Travel Agency Booking Analysis API - top countries  ",
    "parameters": "booking_period+sort_by"
  }, {
    "page": "booking-analysis-top-onds.html",
    "url": "api/v1/booking_agency_onds",
    "Description": "Travel Agency Booking Analysis API - top O&Ds",
    "parameters": "booking_period+sort_by"
  }, {
    "page": "booking-analysis-total.html",
    "url": "api/v1/booking_agency_totals",
    "Description": "Travel Agency Booking Analysis API - total per agency",
    "parameters": "booking_period"
  }, {
    "page": "refdata-airlines.html",
    "url": "api/airlines",
    "Description": "Airline Reference API",
    "parameters": "code"
  }, {
    "page": "refdata-aircrafts.html",
    "url": "api/aircraft",
    "Description": "Aircraft Reference API",
    "parameters": "rest_obeject_id"
  }, {
    "page": "refdata-airports.html",
    "url": "api/airports",
    "Description": "Airport Reference API",
    "parameters": "rest_obeject_id"
  }, {
    "page": "refdata-cities.html",
    "url": "api/cities",
    "Description": "Cities Reference API",
    "parameters": "rest_obeject_id"
  }, {
    "page": "refdata-countries.html",
    "url": "api/countries",
    "Description": "Countries Reference API",
    "parameters": "rest_obeject_id"
  }];

  $scope.setWebservice = function(){
    var item = $scope.selectedWebservice
    config.url = item.url;
    config.param = "?"+item.parameters.split("+").join("=*,")+"=*";
  };

  $scope.chartOptions = [
    "Table",
    'Bar',
    'Line',
    'Pie',
    'Doughnut',
    'Radar',
    'Polar',
    "GoogleMap",
  ];

  $scope.callTI = function() {

    var token = $rootScope.token;
    $http.defaults.headers.common.Authorization = "Token " + token;
    var json = "application/json";
    $http.defaults.headers.common.Accept = json;
    $http.defaults.headers.common["Content-Type"] = json;

    if (!$rootScope.parameters) {
      $rootScope.parameters = {}
    }

    var url = config.url;
    var param = config.param;
    var totalUrl = url + param;

    $http.get(totalUrl).success(function(data) {
      $scope.data = JSON.stringify(data, null, " ");
    }).error(function(error) {
      $scope.data = JSON.stringify(error, null, " ");
    });
  }

  if (config.cache) {
    $scope.data = JSON.stringify(config.data);
  }

  $scope.toggleCache = function() {
    if (!config.cache) {
      config.cache = true;
      config.data = JSON.parse($scope.data);
    } else {
      config.cache = false;
      config.data = "";
      $scope.data = "";
    }
  }
});

angular.module('adf.widget.Parameters', ['adf.provider'])
  .config(function(dashboardProvider) {
    dashboardProvider
      .widget('Parameters', {
        title: 'Parameters',
        description: 'This widget lets you create and update parameters',
        templateUrl: '{widgetsPath}/scripts/services/paramview.html',
        controller: 'ParamCtrl',
        edit: {
          templateUrl: '{widgetsPath}/scripts/services/paramedit.html',
          controller: 'ParamEditCtrl',
        }
      });
  })
.controller('ParamCtrl', function($scope, config, $rootScope) {

  if (!$rootScope.parameters) {
    $rootScope.parameters = {};
    config.parameters.forEach(function(value, index) {
      $rootScope.parameters[value.name] = value.value;
    })
    $rootScope.$broadcast('widgetConfigChanged');
  }

  $scope.refresh = function() {
    config.parameters.forEach(function(value, index) {
      $rootScope.parameters[value.name] = value.value;
    })
    $rootScope.$broadcast('widgetConfigChanged');
  }

})

.controller('ParamEditCtrl', function($scope, config, $rootScope) {

  if (!config.parameters) {
    config.parameters = [];
  }
  $scope.addParam = function() {
    config.parameters.push({
      name: $scope.inputname,
      value: ""
    });
  };
  $scope.deleteParam = function(param) {
    var index = config.parameters.indexOf(param);
    config.parameters.splice(index, 1);
  };

})
