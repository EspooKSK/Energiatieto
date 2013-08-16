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
    
    this.redraw = function(data) {
      this.draw(data);
    };

    this.draw = function(data) {
      var x = drawXAxis(data);
      var y = drawYAxis(data);
      drawLine(data, x, y);
      
      return this;
    };

    function drawXAxis(data){
      var x = d3.scale.linear()
            .range([0, width]);

      var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format(".0f"));

      x.domain(d3.extent(data, function(d) { 
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
    
    function drawYAxis(data){
      var y = d3.scale.linear()
            .range([height, 0]);

      var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

      y.domain([0, d3.max(data, function(d) { return d.cost; })]);

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

    function drawLine(data, x, y){
      if(!cost){
        cost = chart.append("g")
          .attr("class", "cost");
      }

      var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.cost); });

      cost.selectAll("path").remove();

      cost.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(data); });
    }

  };
});
