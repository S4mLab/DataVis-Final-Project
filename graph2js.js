var margin = {top: 100, right: 30, bottom: 30, left: 30};
var w = 1050 - margin.left - margin.right;
var h = 650 - margin.top - margin.bottom;
var padding  = 85;


function init(){

  //convert csv values into object
  var rowConverter = function(d){
    const timeParser = d3.timeParse("%d/%m/%Y"); //convert all the data from string to appropriate data types
    return{
        month:timeParser(d.month),
        Glass:parseInt(d.Glass),
        Hazardous:parseInt(d.Hazardous),
        Metals:parseInt(d.Metals),
        Other:parseInt(d.Other),
        Paper:parseInt(d.Paper),
        Plastics:parseInt(d.Plastics),
        Tyres:parseInt(d.Tyres)
        };
      };

    //extract data from csv file
   d3.csv("exportwaste2.csv", rowConverter).then(function(data){
     console.log(data);

  var databymonth = d3.group(data, d=> d.month); //mapping data based on month

  //x scale
  var xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.month; }))
      .range([padding-5, w-padding]);

  // y scale
  var yScale = d3.scaleLinear()
      .range([h-padding, 0]);

  //create graph
  var svg = d3.select("#graph2")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  //adding the x axis to the svg
  svg.append("g")
     .attr("transform","translate(0, "+(h-padding)+ ")")
     .transition().duration(3000).style("opacity", 1)
     .call(d3.axisBottom(xScale).tickSize(10).tickFormat( d3.timeFormat("%B %Y")));


  var keysused= data.columns.slice(1); //get types of waste used
  var stack = d3.stack().keys(keysused)(data) //data is converted to fit a stacked area chart
  var colors = d3.schemeSet2; //color scheme

  yScale.domain([0, d3.max(stack[stack.length -1], function(d){ return d[1];})]); //domain of y scale calculated

  // y axis added to svg
  svg.append("g")
     .attr("transform","translate( "+ (padding-4)+ ",0 )")
     .transition().duration(3000).style("opacity", 1)
     .call(d3.axisLeft(yScale).tickSize(10));

  //assigning area for stacked area chart
  var area = d3.area()
      .x(function(d){ return xScale(d.data.month);})
      .y0(function(d){return yScale(d[0]);})
      .y1(function(d){return yScale(d[1]);})

  //creating a group of elements to access the waste types
  var series = svg.selectAll("g.myArea")
      .data(stack)
      .enter()
      .append("g")
      .attr("class", "myArea");

  //assigning color for each type of waste
  var path = series.append("path")
      .style("fill", function(d,i){return  colors[i];});

  //creating a path for each waste type
  path.transition()
      .delay(function(d,i){ return i/keysused.length*1000})
      .duration(3000).ease(d3.easeLinear)
      .attr("class",  function(d){return ("myArea " + d.key)})
      .attr("d", function(d){return area(d);});

  //y axis label
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y",10- margin.left)
     .transition().duration(2000).ease(d3.easeLinear)
     .attr("x",0 - (h / 2) + margin.bottom)
     .attr("dy", "2em")
     .attr("font-family", "'PT Sans Narrow', sans-serif")
     .attr("font-size", "15px")
     .style("text-anchor", "middle")
     .text("Total weight of waste exported (Tonnes)");

  //x axis label
  svg.append("text")
     .attr("y", h-margin.bottom)
     .transition().duration(2000).ease(d3.easeLinear)
     .attr("x",w/2 + margin.bottom)
     .attr("dy", "1em")
     .attr("font-family", "'PT Sans Narrow', sans-serif")
     .attr("font-size", "15px")
     .style("text-anchor", "middle")
     .text("Time (month and year)");

  //highlight function
  var hoverhighlight = function(d){

  var newval = d.path[0].className.baseVal //get the class the rectangle belongs to

  d3.selectAll("path.myArea")
    .style("opacity", 0.2) // fade all waste types to a low opacity

  d3.selectAll(".myArea."+newval)
    .style("opacity", 1.0) // the selected waste type will be on the original opacity
  };

  //remove highlighting
 var nohoverhighlight = function(d){

      d3.selectAll(".myArea").style("opacity", 1)};

        //creating a legend to hover over waste types
      var size = 20;
      svg.selectAll("legendrect")
        .data(keysused)
        .enter()
        .append("rect")
        .attr("x",w-margin.right*2.5)
        .attr("y",function(d,i){ return 10+ i*(size+10)})
        .attr("width", size)
        .attr("height", size)
        .attr("class", function(d){return d;})
        .style("fill", function(d,i){return colors[i]})
        .on("mouseover",  hoverhighlight)
        .on("mouseleave", nohoverhighlight);

      //labels for legend
      svg.selectAll("labels")
      .data(keysused)
      .enter()
      .append("text")
      .attr("x", w- margin.bottom-20 )
      .style("fill", function(d,i){return colors[i];})
      .attr("y", function(d,i){ return (10+ i*(size+ 10) + (size/2));})
      .attr("class", function(d){return d;})
      .text(function(d){return d})
      .attr("text-anchor", "left")
      .attr("font-family", "'PT Sans Narrow', sans-serif")
      .style("alignment-baseline", "middle")
      .on("mouseover", hoverhighlight)
      .on("mouseleave", nohoverhighlight);

  //tooltip
  // points created for tooltip
  var point = svg.append("g").attr("class", "point");
   point.append("circle").attr("r", 3);

  var point2 = svg.append("g").attr("class", "point");
    point2.append("circle").attr("r", 3);

  var point3 = svg.append("g").attr("class", "point");
  point3.append("circle").attr("r", 3);

  var point4 = svg.append("g").attr("class", "point");
  point4.append("circle") .attr("r", 3);

  var point5 = svg.append("g").attr("class", "point");
  point5.append("circle").attr("r", 3);

  var point6 = svg.append("g").attr("class", "point");
  point6.append("circle").attr("r", 3);

  var point7 = svg.append("g").attr("class", "point");
  point7.append("circle").attr("r", 3);

  var totalweight= svg.append("text")
                   .attr("class", "total")
                    .attr("x", w/2-margin.left-20 )
                    .style("fill", "black")
                    .attr("y", 2)
                    .style("font-size",20)
                    .attr("font-family", "'Staatliches', cursive")
                    .style("alignment-baseline", "middle")
;



//attributes for tooltips added
  svg.selectAll(".point")
     .style("display", "none")
     .style("fill", "#333d2d")
     .append("text")
     .attr("font-family", "'Staatliches', cursive")
     .attr("x", 9)
     .attr("dy", ".3em")
     .style("font-size",13);



    //make tooltips disappear when moving
      svg.selectAll(".myArea")
      .on("mouseover", function() {
         point.style("display", null);
         point2.style("display", null);
         point3.style("display", null);
         point4.style("display", null);
         point5.style("display", null);
         point6.style("display", null);
         point7.style("display", null);
         totalweight.style("display", "none");
       })
       //hide tootlips when out of graph
     .on("mouseout", function() {
                         point.style("display", "none");
                         point2.style("display", "none");
                         point3.style("display", "none");
                         point4.style("display", "none");
                         point5.style("display", "none");
                         point6.style("display", "none");
                         point7.style("display", "none");
                         totalweight.style("display", "none");

                     })
                     .on("mousemove", function(d){mousemove(d)}); //draws tooltips

      //to find position that a date hovered on in the graph would fit in
      var bisect = d3.bisector(function(d) { return d.month; }).right;

      function mousemove(d){
        var datesel = xScale.invert(d.x); //gets the numberical value in scale for the date
            i = bisect(data, datesel, 1);

            //gets record with earlier date and the record with later date
            d0 = data[i - 1],
                   d1 = data[i],
                   d= datesel- d0.month > d1.month-datesel ? d1 : d0; // determines which data is to be displayed out of the two records based on how close the point is on the x scale

       var lay1= parseInt(d['Glass']) +parseInt(d['Hazardous']) + parseInt(d['Metals']) + parseInt(d["Other"]) + parseInt(d['Paper']) + parseInt(d['Plastics'])+ parseInt(d['Tyres'])
       var lay2= parseInt(d['Glass']) +parseInt(d['Hazardous']) + parseInt(d['Metals']) + parseInt(d["Other"]) + parseInt(d['Paper']) + parseInt(d['Plastics']);
       var lay3= parseInt(d['Glass']) +parseInt(d['Hazardous']) + parseInt(d['Metals']) + parseInt(d["Other"]) + parseInt(d['Paper']) ;
       var lay4= parseInt(d['Glass']) +parseInt(d['Hazardous']) + parseInt(d['Metals']) + parseInt(d["Other"]) ;
       var lay5= parseInt(d['Glass']) +parseInt(d['Hazardous']) + parseInt(d['Metals']) ;
       var lay6= parseInt(d['Glass']) +parseInt(d['Hazardous']);
       var lay7= parseInt(d['Glass']);

       //position the tooltip circles in the appropriate locations
        point7.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay1) + ")");
        point6.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay2) + ")");
        point5.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay3) + ")");
        point4.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay4) + ")");
        point3.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay5) + ")");
        point2.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay6) + ")");
        point.attr("transform", "translate(" + xScale(d.month) + "," + yScale(lay7) + ")");

        // add labels for the tooltips
        point.select("text").text(d['Glass'])
        .attr("dy", "1em")

        point2.select("text").text(d['Hazardous'])
        .attr("dy", "0.1em")
        point3.select("text").text(d['Metals']);
        point4.select("text").text(d['Other']);
        point5.select("text").text(d['Paper']);
        point6.select("text").text(d['Plastics']);
        point7.select("text").text(d['Tyres'])
        .attr("dy","-0.5em");

        d3.selectAll('.point');
        //to display total weight
        totalweight.style("display","inline")
                   .text("Total weight: "+lay1+ " tonnes")
                   .attr("text-anchor", "left");

      }

      })
}



window.onload = init;
