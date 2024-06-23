var svgHeight = 400;
var svgWidth = 600;

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
  var pathString = "m 100,100 c -5,1 -10,2 -15,3 -5,2 -9,2 -13,-3 -9,-7 -18,-14 -25,-21 -7,-6 -12,-11 -18,-16 -4,-4 -7,-7 -9,-11 -4,-5 4,-8 8,-8 12,-4 24,-3 36,0 27,1 54,7 81,10 21,4 42,3 63,4 12,0 14,10 8,17 -7,9 -18,16 -29,21 -24,10 -48,4 -72,-1 -14,-3 -32,-4 -41,12 -16,22 3,34 11,48 10,17 29,21 42,5 16,-22 38,-24 61,-24 22,0 45,-1 67,-3 13,-1 29,-3 38,12 6,6 10,14 14,21 3,8 7,18 2,25 -9,14 -30,18 -45,23 -16,5 -32,10 -48,14 z";


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
}

function updateVisualization(selectedLap) {
  d3.select("#selectedLap").text("Lap: " + selectedLap);
  sampleSVG.selectAll('*').remove();

  createF1Track(sampleSVG, 10);
  createMovingCircle(sampleSVG, selectedLap);
  createDots(sampleSVG, selectedLap);
}

// Initial load
updateVisualization(1);
