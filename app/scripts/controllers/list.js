'use strict';

/**
 * @ngdoc function
 * @name skinEditorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the skinEditorApp
 */
angular.module('basicEditorApp')
    .controller('ListCtrl', function($scope, localStorageService) {
        $scope.objects = localStorageService.keys()

        $scope.add = function() {

            var Tosave = {}
            Tosave.name = $scope.name;
            Tosave.text = "";

            localStorageService.set($scope.name, Tosave);
            $scope.objects = localStorageService.keys()
        }

        $scope.remove = function(name) {
            localStorageService.remove(name);
            $scope.objects = localStorageService.keys()
        }

        $scope.saveAsFile = function(name) {

            var loaded = localStorageService.get(name)

            var blob = new Blob([JSON.stringify(loaded)], {
                type: "text/plain;charset=utf-8"
            });

            saveAs(blob, name + ".json");

        }

        $scope.loadFile = function() {

            var inputElement = $("#inputFile")[0];
            inputElement.addEventListener("change", handleFiles, false);

            function handleFiles() {

                var selected_file = $("#inputFile")[0].files[0];

                var r = new FileReader();

                r.onload = function(e) {
                    var contents = e.target.result;

                    //Put the file in the list
                    var Tosave = JSON.parse(contents)

                    localStorageService.set(selected_file.name.substring(0,selected_file.name.indexOf(".")), Tosave);

                    //Add to objects
                    $scope.$apply(function() {
                        $scope.objects = localStorageService.keys()
                    })       
                }
                r.readAsText(selected_file);
            }
            inputElement.click();
        }

    });