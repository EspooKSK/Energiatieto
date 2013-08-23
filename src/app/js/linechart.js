define([
  "underscore", 
  "d3", 
  "jquery",
  "chart.utilities",
  "tipsy"
], function(_, d3, $, Utils) {
  return function(element) {
    var margin = {top: 10, right: 30, bottom: 20, left: 70},
        width = 560 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,

        svg = d3.select(element)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom),
        
        chart = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var cost;
    
    this.redraw = function(dataSets) {
      this.draw(dataSets);
    };

    this.draw = function(dataSets) {
      var x = drawXAxis(dataSets);
      var y = drawYAxis(dataSets);
      drawLine(dataSets, x, y);
      
      return this;
    };

    function drawXAxis(dataSets){
      var x = d3.scale.linear()
            .range([0, width]);

      var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format(".0f"));
      
      x.domain(d3.extent(dataSets[0], function(d) { 
        return d.year;
      }));

      var axis = chart.selectAll('g.x.axis')
            .data([width])
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

      axis.enter()
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);
      
      axis.exit().remove();
      
      return x;
    }
    
    function drawYAxis(dataSets){
      var y = d3.scale.linear()
            .range([height, 0]);

      var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
      
      var yMax = getDataSetsMaxCost(dataSets);
      y.domain([0, yMax]);

      var axis = chart.selectAll('g.y.axis')
            .data([height])
            .attr("class", "y axis")
            .call(yAxis);


      axis.enter()
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);
      
      axis.exit().remove();
      
      return y;
    }
    
    function getDataSetsMaxCost(dataSets){
      return _.reduce(dataSets, function(max, dataSet){
        var dataSetMax = d3.max(dataSet, function(d) { return d.cost; });
        if(max){
          return d3.max([max, dataSetMax]);
        } else {
          return dataSetMax;
        }
      }, null);
    }

    function drawLine(dataSets, x, y){
      chart.selectAll("g.cost").remove();

      var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.cost); });

      cost = chart.selectAll("g.cost")
        .data(dataSets)
        .enter()
        .append("g")
        .attr("class", "cost")
        .append("path")
        .attr("class", function(data, index){ return "line line" + index; })
        .attr("d", function(data) { return line(data); });
    }
  };
});
