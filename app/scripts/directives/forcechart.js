'use strict';

/**
 * @ngdoc directive
 * @name tiPortal3App.directive:forcechart
 * @description
 * # forcechart
 */
angular.module('tiPortal3App')
  .directive('forcechart', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        data: "=",
      },
      link: function postLink(scope, element, attrs) {

        var margin = 10;
        var width = parseInt(d3.select(element.children()[0]).style("width")) - margin * 2;
        var height = width;

        var color =
          d3.scale.category20().range([
            d3.rgb(0, 169, 224),
            d3.rgb(206, 0, 88),
            d3.rgb(106, 209, 227),
            d3.rgb(229, 106, 84),
            d3.rgb(167, 230, 215),
            d3.rgb(236, 134, 208),
            d3.rgb(255, 181, 73),
            d3.rgb(255, 160, 106),
            d3.rgb(130, 70, 175),
            d3.rgb(210, 159, 19),
            d3.rgb(201, 100, 207),
            d3.rgb(254, 209, 65),
            d3.rgb(0, 169, 224),
            d3.rgb(206, 0, 88),
            d3.rgb(106, 209, 227),
            d3.rgb(229, 106, 84),
            d3.rgb(167, 230, 215),
            d3.rgb(236, 134, 208),
            d3.rgb(255, 181, 73),
            d3.rgb(255, 160, 106),
            d3.rgb(130, 70, 175),
            d3.rgb(210, 159, 19),
            d3.rgb(201, 100, 207),
            d3.rgb(254, 209, 65),
          ]);


        var force = d3.layout.force()
          .charge(-120)
          .linkDistance(30)
          .size([width, height]);

        var svg = d3.select(element.children()[0]).append("svg")
          .attr("width", width)
          .attr("height", height);

        var graph = JSON.parse(JSON.stringify(scope.data));

        force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

        var link = svg.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
          });

        var node = svg.selectAll(".node")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .style("fill", function(d) {
            return color(d.group);
          })
          .call(force.drag);

        node.append("title")
          .text(function(d) {
            return d.name;
          });

        force.on("tick", function() {
          link.attr("x1", function(d) {
              return d.source.x;
            })
            .attr("y1", function(d) {
              return d.source.y;
            })
            .attr("x2", function(d) {
              return d.target.x;
            })
            .attr("y2", function(d) {
              return d.target.y;
            });

          node.attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });
        });

      }
    };
  });


angular.module('tiPortal3App')
  .directive('circlepackchart', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        data: "=",
      },
      link: function postLink(scope, element, attrs) {
        var data = JSON.parse(JSON.stringify(scope.data))
        var margin = 10;
        var w = parseInt(d3.select(element.children()[0]).style("width")) - margin * 2;
        var h = w;

        var r = Math.min(w, h) - 20,
          x = d3.scale.linear().range([0, r]),
          y = d3.scale.linear().range([0, r]),
          node,
          root;

        var pack = d3.layout.pack()
          .size([r, r])
          .value(function(d) {
            return d.size;
          })

        var vis = d3.select(element.children()[0]).insert("svg:svg", "h2")
          .attr("width", w)
          .attr("height", h)
          .append("svg:g")
          .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

        node = root = data;

        var nodes = pack.nodes(root);

        vis.selectAll("circle")
          .data(nodes)
          .enter().append("svg:circle")
          .attr("class", function(d) {
            return d.children ? "parent" : "child";
          })
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          })
          .attr("r", function(d) {
            return d.r;
          })
          .on("click", function(d) {
            return zoom(node == d ? root : d);
          });

        vis.selectAll("text")
          .data(nodes)
          .enter().append("svg:text")
          .attr("class", function(d) {
            return d.children ? "parent" : "child";
          })
          .attr("x", function(d) {
            return d.x;
          })
          .attr("y", function(d) {
            return d.y;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("opacity", function(d) {
            return d.r > 20 ? 1 : 0;
          })
          .text(function(d) {
            return d.name;
          });

        d3.select(window).on("click", function() {
          zoom(root);
        });


        function zoom(d, i) {
          var k = r / d.r / 2;
          x.domain([d.x - d.r, d.x + d.r]);
          y.domain([d.y - d.r, d.y + d.r]);

          var t = vis.transition()
            .duration(d3.event.altKey ? 7500 : 750);

          t.selectAll("circle")
            .attr("cx", function(d) {
              return x(d.x);
            })
            .attr("cy", function(d) {
              return y(d.y);
            })
            .attr("r", function(d) {
              return k * d.r;
            });

          t.selectAll("text")
            .attr("x", function(d) {
              return x(d.x);
            })
            .attr("y", function(d) {
              return y(d.y);
            })
            .style("opacity", function(d) {
              return k * d.r > 20 ? 1 : 0;
            });

          node = d;
          d3.event.stopPropagation();
        }

      }
    };
  });
