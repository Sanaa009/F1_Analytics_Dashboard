var svgHeight = 600;
var svgWidth = 1000;

var colorScale = d3.scaleOrdinal().domain(["MaxV", "CharlesL", "CarlosS", "SergioP"]).range(["#f47c1e", "#6bd3bb", "#bc53f5", "#3474c4"]);

var sampleSVG = d3.select('#viz')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var lapData;

// Load data from CSV
d3.csv('data/austria23.csv').then(function(data) {
  lapData = data;
  updateVisualization(1); // Initial lap
});

// Function to create an F1 track path in SVG
function createF1TrackPath(svg) {
  var pathString = "m 695.50305,486.28737 c -67.69,20.16 -135.8,39.76 -203.7,59.5 -21.7,6.93 -43.96,13.3 -65.8,19.6 -22.19,8.75 -38.85,7.63 -54.6,-11.9 -36.61,-55.23 -77.63,-107.94 -112.7,-164.5 -32.83,-52.99 -56.91,-110.88 -87.5,-165.2 -24.43,-41.02 -56.42,-78.19 -92.399999,-109.2 -15.47,-15.19 -31.08,-30.03 -46.9,-44.1 -5.04,-7.14 -13.51,-11.41 -16.8,-19.6 -8.68,-16.1 8.96,-24.0099999 22.4,-24.4999999 33.32,-5.39000001 67.62,-3.92 100.799999,-0.7 75.18,3.08 149.8,16.7299999 224,26.5999999 59.36,10.36 119.77,7.7 179.2,9.8 33.6,0.35 37.52,33.53 20.3,56 -14.56,19.88 -36.26,34.02 -58.8,42.7 -48.3,21.35 -96.74,8.54 -145.6,-0.7 -29.68,-5.04 -67.2,-7 -86.1,20.3 -34.09,46.34 7.49,90.86 29.4,130.9 27.72,47.18 78.61,59.22 114.1,13.93 43.89,-56.42 106.33,-61.46 172.2,-62.3 58.03,-2.87 115.78,-4.34 172.9,-7.7 33.67,-2.45 73.84999,-6.02 95.89999,23.8 15.68,17.5 21.35,41.37 29.4,62.3 7.28,21.77 17.36,47.81 2.8,67.9 -19.11,29.4 -61.18,36.61 -91.69999,47.6 -33.81,10.43 -66.99,20.86 -100.8,29.47 z";
  return pathString;
}

// Function to create an F1-shaped track in SVG using path
function createF1Track(svg, strokeWidth) {
  var pathString = createF1TrackPath(svg);

  svg.append('path')
    .attr('d', pathString)
    .style('fill', 'red')
    .style('stroke', '#15151e')
    .style('stroke-width', strokeWidth)
    .attr('id', 'f1Track');
}

// Function to create a moving circle
function createMovingCircle(svg, selectedLap) {
  var lapInfo = lapData.find(d => +d.lap === selectedLap);

  var path = d3.select('#f1Track').node();
  var length = path.getTotalLength();
  var oriri = path.getPointAtLength(0);

  var startingPoint = path.getPointAtLength(length);
  svg.append('circle')
    // .style('stroke', 'gray')
    .style('fill', colorScale(lapInfo.pos1))
    .attr('r', 20)
    .attr('cx', startingPoint.x - oriri.x)
    .attr('cy', startingPoint.y - oriri.y)
    .transition()
    .duration(5000)
    .attrTween("transform", function () {
      return function (t) {
        var point = path.getPointAtLength(t * length);
        return "translate(" + point.x + "," + point.y + ")";
      };
    });
}



// Function to create dots for second and third place
function createDots(svg, selectedLap) {
  var lapInfo = lapData.find(d => +d.lap === selectedLap);
  var time1 = lapInfo.time1;
  var time2 = Math.abs(lapInfo.time2);
  var time3 = Math.abs(lapInfo.time3);
  var scale = 1;

  var position2 = ((time1 - time2) / time1) * scale;
  var position3 = ((time1 - time3) / time1) * scale;

  var path = d3.select('#f1Track').node();
  var length = path.getTotalLength();

  // Get the starting point on the track
  var oriri = path.getPointAtLength(0);

  // Calculate the positions of the second and third circles
  var startingPoint2 = path.getPointAtLength(length * position2);
  var startingPoint3 = path.getPointAtLength(length * position3);

  
  
  svg.append('circle')
    .style('fill', colorScale(lapInfo.pos2))
    .attr('r', 20)
    .attr('cx', startingPoint2.x)
    .attr('cy', startingPoint2.y)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .transition()
    .delay(5000)
    .duration(500)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  svg.append('circle')
    .style('fill', colorScale(lapInfo.pos3))
    .attr('r', 20)
    .attr('cx', startingPoint3.x)
    .attr('cy', startingPoint3.y)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .transition()
    .delay(5000)
    .duration(500)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  // Add data to the table
  // var table = d3.select("#positions").select("tbody");
  // table.html(""); // Clear existing rows

  // var data = [
  //   { position: "1rd",  color: colorScale(lapInfo.pos1) , driver: lapInfo.pos1, time: lapInfo.time1},
  //   { position: "2nd", color: colorScale(lapInfo.pos2), driver: lapInfo.pos2, time: -Math.abs(lapInfo.time2)},
  //   { position: "3rd", color: colorScale(lapInfo.pos3), driver: lapInfo.pos3, time: -Math.abs(lapInfo.time3) }
  // ];

  // var rows = table.selectAll("tr")
  //   .data(data)
  //   .enter()
  //   .append("tr");

  // rows.selectAll("td")
  //   .data(function (d) {
  //     return Object.values(d);
  //   })
  //   .enter()
  //   .append("td")
  //   .text(function (d) {
  //     return d;
  //   })
  //   .style("color", function(d, i) {
  //     // Set color for the text based on the column
  //     return i === 3 ? d : null;
  //   });
  var table = d3.select("#positions").select("tbody");
table.html(""); // Clear existing rows

var data = [
  { position: "1rd", color: colorScale(lapInfo.pos1), driver: lapInfo.pos1, time: lapInfo.time1 },
  { position: "2nd", color: colorScale(lapInfo.pos2), driver: lapInfo.pos2, time: -Math.abs(lapInfo.time2) },
  { position: "3rd", color: colorScale(lapInfo.pos3), driver: lapInfo.pos3, time: -Math.abs(lapInfo.time3) }
];

function getColorCodeMapping(colorCode) {
  // Replace this with your custom mapping logic
  var mapping = {
    "#f47c1e": "maxv",
    "#6bd3bb": "charlesl",
    "#bc53f5": "carloss",
    "#3474c4": "sergiop"
    // Add more mappings as needed
  };

  return mapping[colorCode.toLowerCase()] || "default-flag"; // Use a default flag if no mapping is found
}



var rows = table.selectAll("tr")
  .data(data)
  .enter()
  .append("tr");



rows.selectAll("td")
  .data(function (d) {
    return Object.values(d);
  })
  .enter()
  .append("td")
  .html(function (d, i) {
  if (i === 1) {
    var colorCode = d.toLowerCase();
    var flagFileName = getColorCodeMapping(colorCode);
    return "<div style='display: flex; align-items: center;'><div style='width: 10px; height: 20px; background-color:" + colorCode + "'></div><img src='static/flags/" + flagFileName + ".png' alt='" + flagFileName + "' style='margin-left: 5px; width: 40px; height: 20px;'></div>";
  } else {
    return d;
  }
})

}


function goToPreviousLap() {
  var currentLap = parseInt(d3.select("#selectedLap").text().split(" ")[1]);
  var previousLap = Math.max(1, currentLap - 1);
  updateVisualization(previousLap);
}

// Function to go to the next lap
function goToNextLap() {
  var currentLap = parseInt(d3.select("#selectedLap").text().split(" ")[1]);
  var nextLap = Math.min(71, currentLap + 1);
  updateVisualization(nextLap);
}

function updateVisualization(selectedLap) {
  d3.select("#selectedLap").text("Lap: " + selectedLap);
  slider.value(selectedLap);
  sampleSVG.selectAll('*').remove();

  createF1Track(sampleSVG, 10);
  createMovingCircle(sampleSVG, selectedLap);
  createDots(sampleSVG, selectedLap);
}

var slider = d3.sliderHorizontal()
  .min(1)
  .max(71)
  .step(1)
  .width(800)
  .displayValue(false)
  .on('onchange', val => {
    updateVisualization(val);
  });

d3.select('.slider-container').append('svg')
  .attr('width', 1000)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(100,30)')
  .call(slider);
