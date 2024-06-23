
  // The svg
const svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
.scale(120)
.center([0, 10])
.translate([width / 2, height / 2]);



// Data and color scale
let data = new Map();
const colorScale = d3.scaleThreshold()
.domain([100, 200, 250, 300, 350, 400,450])
// .range(d3.schemeGreens[7]);
// .range(["#3A3635","#4F302E","#642A28","#792421","#8E1E1B","#A21814","#B7120D","#CC0C07","#E10600"]);
.range(["#3A3635","#86201D","#951C18","#A41713","#B3130E","#C30F0A","#D20A05","#CC0C07","#E10600"]);
// .range(["#FFFF","#FBE0DF","#F8C1BF","#F4A29F","#F08380","#EC6360","#E94440","#E52520","#E10600"]);

// Create a tooltip div
const tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Load external data and boot
Promise.all([
  d3.json("geojsons/world.geojson"),
  d3.csv("data/viewers.csv", function (d) {
    data.set(d.code, +d.viewers);
    return {
      year: +d.Years,
      name: d.name,
      code: d.code,
      viewers: +d.viewers,
    };
  })
]).then(function (loadData) {
  let topo = loadData[0];
  let dataset = loadData[1];

  // Get unique years for the dropdown
  const uniqueYears = Array.from(new Set(dataset.map(d => d.year)));

  // Populate the dropdown with unique years
  d3.select("#year-select")
    .selectAll("option")
    .data(uniqueYears)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  // Draw the initial map
  updateMap(dataset, topo, uniqueYears[0]);

  // Add event listener to the dropdown
  d3.select("#year-select").on("change", function () {
    const selectedYear = this.value;
    updateMap(dataset, topo, selectedYear);
  });

  function updateMap(dataset, topo, selectedYear) {
    // Filter data for the selected year
    const filteredData = dataset.filter(d => d.year == selectedYear);

    // Remove existing border paths
    svg.selectAll(".border").remove();

    // Draw the map
    svg.selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", function (d) {
            const countryData = filteredData.find(data => data.code === d.id);
            d.total = countryData ? countryData.viewers : 0;
            return colorScale(d.total);
        })
        .on("mouseover", function (event, d) {
            // Highlight the border on mouseover
            svg.append("path")
                .datum(d)
                .attr("class", "border")
                .attr("d", d3.geoPath().projection(projection))
                .attr("fill", "none")
                .attr("stroke", "black") // You can customize the border color
                .attr("stroke-width", 2); // You can customize the border width

        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`Country: ${d.properties.name}<br>Viewership: ${d.total} K`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function () {
            // Remove the border on mouseout
            svg.selectAll(".border").remove();
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }
});


// Define the legend properties
const legendWidth = 300;
const legendHeight = 20;
const legendX = width - legendWidth; // Position on the top-right corner
const legendY = 30; // Adjust the Y position as needed
const numLegendBoxes = 7; // Number of separate boxes

// // Create an SVG group for the legend
// const legend = svg.append("g")
// .attr("class", "legend")
// .attr("transform", `translate(${legendX}, ${legendY})`);

// // Calculate the range for each legend box
// const colorRange = colorScale.range();
// const legendBoxWidth = legendWidth / numLegendBoxes;

// // Create legend color rectangles
// for (let i = 0; i < numLegendBoxes; i++) {
// legend.append("rect")
//   .attr("x", i * legendBoxWidth)
//   .attr("width", legendBoxWidth)
//   .attr("height", legendHeight)
//   .attr("fill", colorRange[i]);
// }

// // Create legend labels for each range
// const legendLabels = [100, 200, 250, 300, 350, 400,450]; // Update with your threshold values
// for (let i = 0; i < numLegendBoxes; i++) {
// legend.append("text")
//   .attr("x", (i * legendBoxWidth + legendBoxWidth / 2))
//   .attr("y", legendHeight + 20)
//   .attr("text-anchor", "middle")
//   .text(legendLabels[i])
//   .style('fill','white');
// }

// // Add a legend title
// legend.append("text")
// .attr("x", legendWidth / 2)
// .attr("y", -10)
// .attr("text-anchor", "middle")
// .text("Viewership in thousands");

// // Optional: Add a legend background
// legend.insert("rect", ":first-child")
// .attr("x", -5)
// .attr("y", 60)
// .attr("width", legendWidth + 10)
// .attr("height", legendHeight + 30)
// .attr("fill", "white")
// .attr("opacity", 0.7);

// Create an SVG group for the legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${legendX}, ${legendY})`);

// Calculate the range for each legend box
const colorRange = colorScale.range();
const legendBoxWidth = legendWidth / numLegendBoxes;

// Create legend items (rectangle + text)
const legendItems = legend.selectAll(".legend-item")
  .data(colorRange)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(${i * legendBoxWidth}, 0)`);

// Create legend color rectangles
legendItems.append("rect")
  .attr("width", legendBoxWidth)
  .attr("height", legendHeight)
  .attr("fill", d => d);

// // Create legend labels for each range
// legendItems.append("text")
//   .attr("x", legendBoxWidth / 2)
//   .attr("y", legendHeight + 20)
//   .attr("text-anchor", "middle")
//   .text((d, i) => legendLabels[i]);  // Set text color here

// Create legend labels for each range
const legendLabels = [100, 200, 250, 300, 350, 400,450]; // Update with your threshold values
for (let i = 0; i < numLegendBoxes; i++) {
legend.append("text")
  .attr("x", (i * legendBoxWidth + legendBoxWidth / 2))
  .attr("y", legendHeight + 20)
  .attr("text-anchor", "middle")
  .text(legendLabels[i])
  .style('fill','white');
}

// Add a legend title
legend.append("text")
  .attr("x", legendWidth / 2)
  .attr("y", 60)
  .attr("text-anchor", "middle")
  .text("Viewership in thousands")
  .style("fill","white");

// Optional: Add a legend background
legend.insert("rect", ":first-child")
  .attr("x", -5)
  .attr("y", 60)
  .attr("width", legendWidth + 10)
  .attr("height", legendHeight + 30)
  .attr("opacity", 1);