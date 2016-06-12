'use strict';

/**
 * @ngdoc function
 * @name tiPortal3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiPortal3App
 */
angular.module('tiPortal3App')
  .controller('MainCtrl', function(FileSaver, $scope, $rootScope, localStorageService, $http) {

    $scope.$watch("token", function notify(newvalue, oldvalue) {
      $rootScope.token = newvalue;
      localStorageService.set("token", newvalue);
    });

    $scope.token = localStorageService.get("token");

    $scope.saveModel = function() {
      var blob = new Blob([JSON.stringify($scope.dashboard.model)], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "dashboard.json");
    };

    var handleFiles = function() {
      var selected_file = $("#inputFile")[0].files[0];
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        //Put the file in the list
        var load = JSON.parse(contents);
        //Add to objects
        $scope.$apply(function() {
          localStorageService.set("dashboard", JSON.stringify(load));
          $scope.dashboard = {
            model: load
          };
        });
      };
      r.readAsText(selected_file);
    };
    $("#inputFile").change(handleFiles);

    $scope.loadModel = function() {
      $("#inputFile").trigger("click");
    };

    var model = JSON.parse(localStorageService.get("dashboard"));

    if (!model) {
      model = {
        rows: [{
          columns: [{
            styleClass: 'col-md-4',
            widgets: []
          }, {
            styleClass: 'col-md-8',
            widgets: []
          }]
        }]
      };
    }

    $scope.dashboard = {
      model: model
    };

    $scope.$on('adfDashboardChanged', function(event, name, model) {
      localStorageService.set(name, model);
      localStorageService.set("dashboard", JSON.stringify(model));
    });

    $scope.getURL = function() {
      $('#getURL').modal('show')
    }

    $scope.loadURL = function() {
      $('#getURL').modal('hide');

      $http({
        method: 'GET',
        url: $scope.dashURL
      }).then(function successCallback(response) {
        var dash = response.data
        localStorageService.set("dashboard", JSON.stringify(dash));
        $scope.dashboard = {
          model: dash
        };
      }, function errorCallback(response) {
        console.log("Incorrect URL")
      });

    }

  });
