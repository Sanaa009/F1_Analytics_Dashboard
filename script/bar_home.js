//load fonts//ß

// Load the CSV data and create the bar chart
d3.csv("data/Constructor_Standing.csv").then(function(data) {
    var svg = d3.select("#chart");
    var margin = { top: 20, right: 10, bottom: 160, left: 90 };
    var bwidth = +svg.attr("width") - margin.left - margin.right;
    var bheight = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, bwidth])
        .padding(0.1);

    var y = d3.scaleLinear()
        .range([bheight, 0]);

    var selectedData = "Points"; // Default data selection

    var xAxis = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + bheight + ")");

    // Define the X-axis title
    var xAxisTitle = g.append("text")
        .attr("class", "x-axis-title")
        .attr("text-anchor", "middle")
        .attr("x", bwidth / 2)
        .attr("y", bheight + 70) // Adjust for margin
        .text("F1 Teams"); // Default X-axis title

    var yAxis = g.append("g")
        .attr("class", "y-axis");

    // Define the Y-axis title
    var yAxisTitle = g.append("text")
        .attr("class", "y-axis-title")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -bheight / 2)
        .attr("y", -margin.left + 40) // Adjust for margin
        .text("Points"); // Default Y-axis title

    var years = Array.from(new Set(data.map(function(d) { return d.Year; })));

    var yearDropdown = d3.select("#yearDropdown");
    yearDropdown.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .text(function(d) { return d; });

    var selectedYear = years[0];

    yearDropdown.on("change", function() {
        selectedYear = d3.select(this).property("value");
        updateChart(selectedData, selectedYear);
    });


    d3.select("#ascendingButton")
        .on("click", function() {
            sortBarsAscending();
        });

    d3.select("#descendingButton")
        .on("click", function() {
            sortBarsDescending();
        });

    d3.select("#resetButton")
        .on("click", function() {
            resetChart();
            resetSelection(); // Reset the top and bottom selections
        });

    var top5ButtonClicked = false; // To track whether the top 5 button is clicked
    var bottom3ButtonClicked = false; // To track whether the bottom 3 button is clicked

    // Event handler for the "Show Top 5" button
    d3.select("#top5Button")
        .on("click", function() {
            top5ButtonClicked = true;
            bottom3ButtonClicked = false; // Ensure only one selection is active
            updateChart(selectedData, selectedYear);
        });

    // Event handler for the "Show Bottom 3" button
    d3.select("#bottom3Button")
        .on("click", function() {
            bottom3ButtonClicked = true;
            top5ButtonClicked = false; // Ensure only one selection is active
            updateChart(selectedData, selectedYear);
        });

    // Function to filter the top 5 teams
    function filterTop5(data, dataKey, year) {
        // Sort the data in descending order based on the selected dataKey
        data.sort(function(a, b) {
            return b[dataKey].replace(/,/g, "") - a[dataKey].replace(/,/g, "");
        });

        // Take the top 5 teams
        return data.slice(0, 5);
    }

    // Function to filter the bottom 3 teams
    function filterBottom3(data, dataKey, year) {
        // Sort the data in ascending order based on the selected dataKey
        data.sort(function(a, b) {
            return a[dataKey].replace(/,/g, "") - b[dataKey].replace(/,/g, "");
        });

        // Take the bottom 3 teams
        return data.slice(0, 3);
    }

    // Function to reset the top and bottom selections
    function resetSelection() {
        top5ButtonClicked = false;
        bottom3ButtonClicked = false;
    }

    // Function to sort bars in ascending order
    function sortBarsAscending() {
        if (top5ButtonClicked || bottom3ButtonClicked) {
            resetSelection(); // Reset the selections before sorting
        }
        data.sort(function(a, b) {
            return a[selectedData].replace(/,/g, "") - b[selectedData].replace(/,/g, "");
        });
        updateChart(selectedData, selectedYear);
    }

    // Function to sort bars in descending order
    function sortBarsDescending() {
        if (top5ButtonClicked || bottom3ButtonClicked) {
            resetSelection(); // Reset the selections before sorting
        }
        data.sort(function(a, b) {
            return b[selectedData].replace(/,/g, "") - a[selectedData].replace(/,/g, "");
        });
        updateChart(selectedData, selectedYear);
    }

    // Function to reset the chart
    function resetChart() {
        resetSelection(); // Reset the selections before resetting the chart
        data.sort(function(a, b) {
            return a.F1_Teams.localeCompare(b.F1_Teams);
        });
        updateChart(selectedData, selectedYear);
    }

    // Function to update the chart with filtered data
    function updateChart(dataKey, year) {
        var filteredData = data.filter(function(d) {
            return d.Year === year;
        });

        if (top5ButtonClicked) {
            filteredData = filterTop5(filteredData, dataKey, year);
        } else if (bottom3ButtonClicked) {
            filteredData = filterBottom3(filteredData, dataKey, year);
        }

        update(filteredData, dataKey);
    }

    // Function to update the chart with data
    function update(data, dataKey) {
        x.domain(data.map(function(d) { return d.F1_Teams; }));
        y.domain([0, d3.max(data, function(d) { return +d[dataKey].replace(/,/g, ""); })]);

        xAxis.transition()
            .duration(1000)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 10)
            .attr("x", -10)
            .attr("dy", ".35em")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .style("font-size", "10px")
            .style("font-family", "Titillium Web");

        yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(",.1f")))
            .style("font-size", "14px")
            .style("font-family", 'Titillium Web');

        var bars = g.selectAll(".bar")
            .data(data, function(d) { return d.F1_Teams; });

        // Define a color scale using a linear gradient
        var colorScale = d3.scaleLinear()
            .domain([0, data.length])
            .range(["#E10600", "#3A3635"]);
            // .range(["#203E17", "#A9B733"]);


        bars.exit()
            .transition()
            .duration(1000)
            .attr("height", 0)
            .remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d.F1_Teams); })
            .attr("y", function(d) { return y(+d[dataKey].replace(/,/g, "")); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return bheight - y(+d[dataKey].replace(/,/g, "")); })
            .style("fill", function(d, i) {
                return colorScale(i);
            });
    }

    // Initial chart setup
    updateChart(selectedData, selectedYear);

    // Tooltip setup
    var tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-family", "Titillium Web");

    // Add event handlers to show/hide the tooltip
    var bars = g.selectAll(".bar")
        .data(data, function(d) { return d.F1_Teams; });

    bars.on("mouseover", function(event, d) {
        var [x, y] = d3.pointer(event);
        var tooltipX = x + margin.left;  // Adjust for margins
        var tooltipY = y - 40;  // Shift tooltip up
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html("Team: " + d.F1_Teams + "<br>" + selectedData + ": " + d[selectedData])
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px");
    })
    .on("mouseout", function() {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
});
