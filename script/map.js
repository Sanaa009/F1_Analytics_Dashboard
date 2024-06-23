"use strict";
var g, map, path, width, height, svgMap, projection, mapIsHidden, mapIsZoomed, activeLocation, version = "v1.1.0";
var circuitLocations;  // Define circuitLocations globally
function loadD3Map() {
    projection = d3.geo.naturalEarth().scale(width / 6).translate([width / 2, height / 2]).rotate([-10, 0]).precision(.1);
    path = d3.geo.path().projection(projection);
    svgMap = d3.select("#world").append("svg").attr("width", width).attr("height", height);
    g = svgMap.append("g");
    
    g.append("defs").append("path").datum({ type: "Sphere" }).attr("id", "sphere").attr("d", path);
    g.selectAll(".stroke, .fill").data(["stroke", "fill"]).enter().append("use").attr("class", d => d).attr("xlink:href", "#sphere");
    g.append("path").datum(d3.geo.graticule()).attr("class", "graticule").attr("d", path);
    
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json", (function(error, worldData) {
        if (error) throw error;
        
        g.insert("path", ".graticule").datum(topojson.feature(worldData, worldData.objects.land)).attr("class", "land").attr("d", path);
        g.insert("path", ".graticule").datum(topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b)).attr("class", "boundary").attr("d", path);
        
        d3.json("geojsons/f1-locations.json", (function(error, circuitData) {
            if (error) throw error;
            circuitLocations = circuitData;
            loadCircuitLocations();
        }));
    }));
}


function loadMapbox() {
    mapboxgl.accessToken = "pk.eyJ1IjoibGFrc2hpc2hldHR5IiwiYSI6ImNscGs5dzhsbjA3Y3kyaXQ0djhudmUzM3gifQ.I-6G9a9wHT-l0EB9MxjxXQ";

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/lakshishetty/clpkbxymg007q01pxb3zd76fc',
        center: [0, 25],
        zoom: 1
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on("load", function() {
        loadD3Map();
        map.addSource("f1_circuits", {
            type: "geojson",
            data: "geojsons/f1-circuits.geojson"
        });

        map.addLayer({
            id: "circuits",
            type: "line",
            source: "f1_circuits",
            paint: {
                "line-color": "#FFFB04",
                "line-width": 9,
                "line-opacity": .9
            }
        });

        map.on("idle", loadCircuitLocations);
    });

    mapIsHidden = true;
    mapIsZoomed = false;
}


function loadCircuitLocations() {
    // Remove existing markers
    g.selectAll(".marker").remove();

    // Assuming circuitLocations is a global variable or fetched already
    const menuOptions = [{
        lat: "25",
        lon: "0",
        zoom: "1",
        location: "",
        name: "Select a circuit"
    }].concat(circuitLocations);

    // Update the #menu element with menu options
    d3.select("#menu")
        .on("change", change)
        .selectAll("option")
        .data(menuOptions)
        .enter()
        .append("option")
        .text(d => d.location + " - " + d.name)
        .attr("value", d => JSON.stringify(d));
}






function change() {
    var t = JSON.parse(this.value);
    map.flyTo({
        center: [t.lon, t.lat],
        zoom: t.zoom,
        bearing: 0
    })
}
function resetZoom() {
    g.selectAll(".locations").classed("active", activeLocation && !1),
    g.selectAll("circle").transition().duration(200).attr("r", 4).style("fill", "#ff3f00"),
    activeLocation = void 0,
    svgMap.transition().duration(800).call(zoom.translate([0, 0]).scale(1).event),
    document.getElementById("location").style.display = "none",
    mapIsZoomed = !1
}
function showLocation(t, e) {
    if (t && activeLocation !== t) {
        var o = 8;
        mapIsZoomed && (o = 4),
        d3.select(e).transition().duration(400).attr("r", o).style("fill", "#0969a2"),
        g.selectAll(".locations").classed("active", activeLocation && !1),
        activeLocation = void 0;
        var a = document.getElementById("location");
        a.innerHTML = t.location + " - " + t.name,
        a.style.display = "inline"
    }
}
function hideLocation(t, e) {
    if (!activeLocation) {
        var o = 4;
        mapIsZoomed && (o = 2),
        d3.select(e).transition().duration(200).attr("r", o).style("fill", "#ff3f00"),
        document.getElementById("location").style.display = "none"
    }
}
function zoomToClick(t) {
    var e, o, a;
    if (!t || activeLocation === t)
        return resetZoom();
    e = this.cx.baseVal.value,
    o = this.cy.baseVal.value,
    a = 8,
    g.selectAll("circle").transition().duration(200).attr("r", 2).style("fill", "#ff3f00"),
    showLocation(t, this),
    activeLocation = t,
    mapIsZoomed = !0;
    var n = [width / 2 - a * e, height / 2 - a * o];
    g.selectAll(".locations").classed("active", activeLocation && function(t) {
        return t === activeLocation
    }
    ),
    svgMap.transition().duration(800).call(zoom.translate(n).scale(a).event),
    map.flyTo({
        center: [t.lon, t.lat],
        zoom: t.zoom,
        bearing: 0
    })
}

function setSize() {
    var t = window.innerWidth;
    var e = window.innerHeight;
    var mapWidth = Math.min(1200, t) - 280; // Set a maximum width of 600 pixels
    var mapHeight = mapWidth / 2  ; // Set the height to be half of the width

    // Adjust positioning of the map container
    var mapContainer = document.getElementById("map");
    mapContainer.style.width = mapWidth + "px";
    mapContainer.style.height = mapHeight + "px";
    mapContainer.style.top = mapHeight - 400 + "px";
    mapContainer.style.marginLeft = "auto"; // Center horizontally

    // Adjust positioning of the world container
    var worldContainer = document.getElementById("world");
    worldContainer.style.width = mapWidth + "px";
    worldContainer.style.height = mapHeight + "px";
    worldContainer.style.marginLeft = "auto"; // Center horizontally
    worldContainer.style.marginTop = "20px"; // Adjust the top margin as needed

    // Adjust positioning of the location container
    var locationContainer = document.getElementById("location");
    locationContainer.style.bottom = mapHeight + 50 + "px"; // Adjust the bottom margin as needed
    locationContainer.style.marginLeft = "auto"; // Center horizontally

    // Additional adjustments for small screens
    if (t < 141) {
        worldContainer.style.bottom = "35px";
        locationContainer.style.bottom = mapHeight + 50 + "px";
    }
}


d3.select("#switch").on("click", (function() {
    mapIsHidden ? (d3.select("#world").classed("hidden", !1),
    d3.select("#menu").classed("hidden", !0),
    setSize(),
    mapIsHidden = !1) : (d3.select("#world").classed("hidden", !0),
    d3.select("#menu").classed("hidden", !1),
    document.getElementById("world").style.width = 0,
    document.getElementById("world").style.height = 0,
    document.getElementById("location").style.display = "none",
    mapIsHidden = !0)
}
)),
document.addEventListener("DOMContentLoaded", (function(t) {
    console.log(version),
    setSize(),
    loadMapbox()
}
));
