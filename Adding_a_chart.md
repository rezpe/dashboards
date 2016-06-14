#Steps to add a Chart

* We add a directive with the code specifying the data, width and height of the Chart

```javascript
angular.module('tiPortal3App')
  .directive('circlepackchart', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        data: "=",
      },
      link: function postLink(scope, element, attrs) {
        //Code to be written here
      }
    };
  });
  ```

* We add the css in the charts.css file with the directive name

* We add the chart type in the view.html

* We add the chart to the list in widget.js

* We add the data evaluation in the widget.js file

* We add a data description in the edit file

* we test the data in a dashboard
