'use strict';

angular.module('adf.widget.Graph', ['adf.provider', ])

.config(function(dashboardProvider) {
  dashboardProvider
    .widget('Graph', {
      title: 'Graph',
      description: 'It shows a graph',
      templateUrl: '{widgetsPath}/Graph/src/view.html',
      reload: true,
      controller: 'GraphCtrl',
      resolve: {
        data: function(config, $http, $q, $window) {

          if (!config.query) {
            return
          }
          //We create the job and we keep on chekcing the status until
          //an answer is available
          var token = $window.sessionStorage.token
          $http.defaults.headers.common.Authorization = "Token " + token;
          var json = "application/json"
          $http.defaults.headers.common.Accept = json;
          $http.defaults.headers.common["Content-Type"] = json;

          var host = "https://staging-api.travel-intelligence.com/ti-sql-raw/api/metal/v1/sql/queries";
          var query = {
            queries: {
              sql: config.query
            }
          };
          var deferred = $q.defer();

          $http.post(host, query).success(function(data) {
            var href = data.queries.href;
            //Once we get the id we keep on calling the web service to check status
            //if good, we retrieve the data
            (function checkStatus() {
              $http.get(href + "?offset=0&limit=100000").success(function(data) {
                if (data.queries.status == "finished") {
                  console.log(data)
                  deferred.resolve(data);
                } else {
                  setTimeout(checkStatus, 1000);
                }
              }).error(function() {
                deferred.reject();
              });
            }());

          }).error(function() {
            deferred.reject();
          });

          return deferred.promise;
        }
      },
      edit: {
        templateUrl: '{widgetsPath}/Graph/src/edit.html',
        controller: 'EditGraphCtrl',
      }
    });
})

//ViewController
.controller('GraphCtrl', function($scope, data, config) {

  if (data) {
    $scope.chartType = config.chartType

    if (config.chartType == "Table") {
      $scope.labels = data.queries.schema
      $scope.data = data.queries.rows
    }
    if (['Bar', 'Line', 'Pie', 'Doughnut', 'Radar', 'Polar'].indexOf(config.chartType) != -1) {
      $scope.labels = eval(config.labelsFormula)
      $scope.data = eval(config.dataFormula)
    }
    if (['Map'].indexOf(config.chartType) != -1) {
      $scope.points = eval(config.pointsFormula)
      $scope.routes = eval(config.routesFormula)
      $scope.center = eval(config.center)
      $scope.scale = eval(config.scale)
    }
    if (['Gauge'].indexOf(config.chartType) != -1) {
      $scope.title = config.title
      $scope.label = config.label
      $scope.value = eval(config.value)
      $scope.min = eval(config.min)
      $scope.max = eval(config.max)
    }
    if (['GoogleMap'].indexOf(config.chartType) != -1) {
      $scope.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: parseInt(config.scale)
      }
      if (config.geocoding = true) {

        var googleGeocoder = new GeocoderJS.createGeocoder({
          'provider': 'google'
        });

        googleGeocoder.geocode(config.center, function(result) {
          $scope.$apply(function() {
            $scope.map.center.latitude = result[0].latitude;
            $scope.map.center.longitude = result[0].longitude;
          })
        });

        $scope.points = eval(config.pointsFormula);

        $scope.points = $scope.points.map(function(value, index) {
          value.id = value.name;
          value.options = {}
          value.options.title = value.name
          return value;
        });

        $scope.points.forEach(function(value, index) {
          googleGeocoder.geocode(value.name, function(result) {
            $scope.$apply(function() {
              $scope.points[index].latitude = result[0].latitude;
              $scope.points[index].longitude = result[0].longitude;
            });
          });
        });

        $scope.routes = eval(config.routesFormula)

        $scope.routes = $scope.routes.map(function(value, index) {
          value.path = [{}, {}];
          value.geodesic = true;
          return value;
        })

        $scope.routes.geodesic = true;

        $scope.routes.forEach(function(value, index) {
          googleGeocoder.geocode(value.origin, function(result) {
            $scope.$apply(function() {
              $scope.routes[index].path[0].latitude = result[0].latitude;
              $scope.routes[index].path[0].longitude = result[0].longitude;
            });
          });

          googleGeocoder.geocode(value.destination, function(result) {
            $scope.$apply(function() {
              $scope.routes[index].path[1].latitude = result[0].latitude;
              $scope.routes[index].path[1].longitude = result[0].longitude;
            });
          });

        });


      } else {
        $scope.points = eval(config.pointsFormula)
        $scope.routes = eval(config.routesFormula)
      }

    }
  }
})

//Editor Controller
.controller('EditGraphCtrl', function($scope, config, $rootScope) {

  $scope.showws = false;
  $scope.webservices = [{
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
  }]

  $scope.showWs = function() {
    $scope.showws = true;
  }



  $scope.jsedit = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'javascript',
  };

  $scope.sqledit = {
    lineWrapping: true,
    lineNumbers: true,
    mode: 'sql',
  };

  $scope.chartOptions = [
    "Table",
    'Bar',
    'Line',
    'Pie',
    'Doughnut',
    'Radar',
    'Polar',
    'Gauge',
    "Map",
    "GoogleMap",
  ]

})
