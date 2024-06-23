 // Load data from CSV file
 d3.csv('data/rank_data.csv').then(function(data) {
    // Group data by driver
    const groupedData = d3.nest()
        .key(d => d.driver)
        .entries(data);

    // Set up SVG dimensions
    const margin = { top: 50, right: 100, bottom: 50, left: 50};
    const width = 1200 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select('#line-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Set up scales with appropriate margins
    const xScale = d3.scalePoint()
        .domain(data.map(d => d.race_country))
        .range([0, width-200]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.points)])
        .range([height, 0]);

    // Set up line function
    const line = d3.line()
        .x(d => xScale(d.race_country))
        .y(d => yScale(d.points));

    // Draw lines for each driver
    const lines = svg.selectAll('.line')
        .data(groupedData)
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => ['#f47c1e', '#3474c4', '#6bd3bb','#358b75', '#fa1435'][i]) // Replace with your hex colors
        .style('opacity', 0)
        .on('mouseover', handleMouseOverLine)
        .on('mouseout', handleMouseOut);
    // Add x-axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text('Race Country')
        .style('font-family','Formula1-Regular')
        .style('font-size',"15px");

    // Add y-axis
    svg.append('g')

        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -45)
        .attr('x', -50)
        .attr('dy', '0.71em')
        .attr('dy', '1.5em')
        .attr('fill', '#000')
        .text('Points')
        .style('font-family','Formula1-Regular')
        .style('font-size',"15px");

    // Define tooltip
    const tip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0])
        .style('font-family','Titillium Web')
        .style('background', '#e10b00')
        .style('color', 'white')
        .html(d => `${d.team} - ${d.driver}<br>Points: ${d.points}<br>Race Country: ${d.race_country}<br>Home Country: ${d.homecountry}`);

    // Call tooltip on SVG
    svg.call(tip);

    // Tooltip event handlers for lines
    function handleMouseOverLine(d) {
        tip.show(d.values[0], this);
    }

    function handleMouseOut() {
        tip.hide();
    }

    // Animation
    lines.transition()
        .duration(8000)
        .style('opacity', 1)
        .attrTween('stroke-dasharray', function() {
            const totalLength = this.getTotalLength();
            return d3.interpolate(`0,${totalLength}`, `${totalLength},${totalLength}`);
        })
        .on('start', moveImages); // Call moveImages at the start of the animation

    // Function to move images along lines
// Function to move images along lines
function moveImages() {
groupedData.forEach(function (driverData, index) {
const path = svg.select('.line:nth-child(' + (index + 1) + ')');
const totalLength = path.node().getTotalLength();

// Draw circles at data points
const circles = svg.selectAll('.circle-' + index)
    .data(driverData.values)
    .enter()
    .append('circle')
    .attr('class', 'circle circle-' + index)
    .attr('cx', d => xScale(d.race_country))
    .attr('cy', d => yScale(d.points))
    .attr('r', 4)
    .style('fill', '#15151e')
    .style('opacity', 0)
    .on('mouseover', handleMouseOverCircle)
    .on('mouseout', handleMouseOut);

// Transition for circles
circles.transition()
    .duration(500)
    .delay((d, i) => i * (8000 / driverData.values.length)) // Delay based on the position of the data point
    .style('opacity', 1);

// Move images along lines

if (driverData.key) { // Check if driverData.key is defined

    const image = svg.append('image')
        .attr('class', 'driver-image')
        .attr('href', `static/drivers/${driverData.values[0].idx}.png`) // Replace with the actual path to the images
        .attr('width', 20)
        .attr('height', 20);

    image.attr('transform', function () {
        const point = path.node().getPointAtLength(0);
        return `translate(${point.x - 10},${point.y - 0})`;
    });

    image.transition()
        .duration(8000)
        .attrTween('transform', function () {
            return function (t) {
                const length = totalLength * t;
                const point = path.node().getPointAtLength(length);
                return `translate(${point.x - 0},${point.y - 55})`;
            };
        });
}
});
}


    // Tooltip event handler for circles
function handleMouseOverCircle(d) {
tip.show(d, this);
}

// Event handler for circles
function handleMouseOut() {
tip.hide();
}
// Create legend



}).catch(function(error) {
    console.log('Error loading data: ' + error.message);
});
