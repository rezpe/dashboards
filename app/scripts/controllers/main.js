'use strict';

/**
 * @ngdoc function
 * @name tiPortal3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiPortal3App
 */
angular.module('tiPortal3App')
  .controller('MainCtrl', function($scope, $rootScope) {

    $scope.$watch("token", function notify(newvalue, oldvalue) {
      $rootScope.token = newvalue;
    })

    $scope.saveModel = function() {
      var blob = new Blob([JSON.stringify($scope.dashboard)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "dashboard.json");
    }

    $scope.loadModel = function() {
      var inputElement = $("#inputFile")[0];
      inputElement.addEventListener("change", handleFiles, false);
      function handleFiles() {
        var selected_file = $("#inputFile")[0].files[0];
        var r = new FileReader();
        r.onload = function(e) {
          var contents = e.target.result;
          //Put the file in the list
          var load = JSON.parse(contents);
          //Add to objects
          $scope.$apply(function() {
            $scope.dashboard = load;
          })
        }
        r.readAsText(selected_file);
      }
      inputElement.click();
    }
  });
