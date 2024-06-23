// Declare firstColumnData outside the d3.json block for broader scope
var firstColumnData;

// Load JSON data from a file
d3.json("geojsons/standings.json").then(function (jsonData) {
    // Mapping of country codes to flag image URLs and a common hyperlink
    var flagData = {
        "B":{"image":"bahrin.png","link":"https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix#Race_classification"},
        "SA":{"image":"saudi-arabia.png","link":"https://en.wikipedia.org/wiki/2023_Saudi_Arabian_Grand_Prix#Race_classification"},
        "A":{"image":"australia.png","link":"https://en.wikipedia.org/wiki/2023_Australian_Grand_Prix#Race_classification"},
        "AZ":{"image":"azerbaijan.png","link":"https://en.wikipedia.org/wiki/2023_Azerbaijan_Grand_Prix#Race_classification"},
        "MO":{"image":"monaco.png","link":"https://en.wikipedia.org/wiki/2023_Monaco_Grand_Prix#Race_classification"},
        "SP":{"image":"spain.png","link":"https://en.wikipedia.org/wiki/2023_Spanish_Grand_Prix#Race_classification"},
        "C":{"image":"canada.png","link":"https://en.wikipedia.org/wiki/2023_Canadian_Grand_Prix#Race_classification"},
        "AU":{"image":"austria.png","link":"https://en.wikipedia.org/wiki/2023_Austrian_Grand_Prix#Race_classification"},
        "BR":{"image":"united-kingdom.png","link":"https://en.wikipedia.org/wiki/2023_British_Grand_Prix#Race_classification"},
        "H":{"image":"hungary.png","link":"https://en.wikipedia.org/wiki/2023_Hungarian_Grand_Prix#Race_classification"},
        "BE":{"image":"belgian.png","link":"https://en.wikipedia.org/wiki/2023_Belgian_Grand_Prix#Race_classification"},
        "NL":{"image":"netherland.png","link":"https://en.wikipedia.org/wiki/2023_Dutch_Grand_Prix#Race_classification"},
        "IT":{"image":"itay.png","link":"https://en.wikipedia.org/wiki/2023_Italian_Grand_Prix#Race_classification"},
        "SI":{"image":"singapore.png","link":"https://en.wikipedia.org/wiki/2023_Singapore_Grand_Prix#Race_classification"},
        "J":{"image":"japan.png","link":"https://en.wikipedia.org/wiki/2023_Japanese_Grand_Prix#Race_classification"},
        "Q":{"image":"qatar.png","link":"https://en.wikipedia.org/wiki/2023_Qatar_Grand_Prix#Race_classification"},
        "US":{"image":"united-states.png","link":"https://en.wikipedia.org/wiki/2023_Las_Vegas_Grand_Prix#Race_classification"},
        "ME":{"image":"mexico.png","link":"https://en.wikipedia.org/wiki/2023_Mexico_City_Grand_Prix#Race_classification"},
        "AD": { "image": "abu-dhabi.png", "link": "https://en.wikipedia.org/wiki/2023_Abu_Dhabi_Grand_Prix#Race_classification" }
    };

    // Assign jsonData to firstColumnData
    firstColumnData = jsonData.slice(0, 11);

    // Split jsonData into two arrays, each containing 11 entries
    var secondColumnData = jsonData.slice(11);

    // Create the first table
    createTable("table1", firstColumnData, flagData, onRowClick);

    // Create the second table
    createTable("table2", secondColumnData, flagData);

}).catch(function (error) {
    console.error("Error loading JSON data:", error);
});

function createTable(tableId, data, flagData, rowClickCallback) {
    // Create a table using D3.js
    var table = d3.select("#" + tableId).classed("column-table", true);

    // Append the data rows for the table
    var rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .on("click", function (d) {
            // Call the rowClickCallback when a row is clicked
            rowClickCallback(d);
        });

    // Populate the cells with data for the table
    rows
        .selectAll("td")
        .data(function (d) {
            // Combine "Grand Prix," "Circuit," and "Race Date" data into one string
            // var dataString =
            //     d["Grand Prix"] + "<br>" + d["Circuit"] + "<br>" + d["Race date"];

            var dataString =
                `<strong>${d["Grand Prix"]}</strong><br>` + // Header
                d["Circuit"] + "<br>" + // Existing line
                d["Race date"];
            
            var countryCode = d["Country Code"];
            var flagImage = 'static/flags/'+flagData[countryCode].image;
            var flagLink = flagData[countryCode].link || "#"; // Default to "#" if no link is provided

            // return [
            //     `<a href="${flagLink}" target="_blank"><img src="${flagImage}" alt="${countryCode} Flag" width="55" height="50" style="border-radius: 50%;"></a>`, // Make the flag clickable
            //     dataString,
            // ];
            return [
                `<a href="${flagLink}" target="_blank"><img src="${flagImage}" alt="${countryCode} Flag" width="30" height="30"></a>`, // Removed border-radius style
                dataString,
            ];
        })
        .enter()
        .append("td")
        .html(function (d) {
            return d;
        }) // Use html() to interpret line breaks and include the flag image
        .on("mouseover", function () {
            // Add hover effect on mouseover
            d3.select(this).style("background-color", "black");
        })
        .on("mouseout", function () {
            // Remove hover effect on mouseout
            d3.select(this).style("background-color", "transparent");
        });
}

// Callback function for row click event
function onRowClick(data) {
    // Fetch JSON data dynamically based on the clicked row
    var jsonFilePath = getJsonFilePath(data);

    // Load JSON data dynamically
    d3.json(jsonFilePath).then(function (popupData) {
        // Create a new table with the loaded JSON data
        createPopupTable(popupData);
    }).catch(function (error) {
        console.error("Error loading JSON data:", error);
    });
}

function createPopupTable(data) {
    // Create a new table using D3.js
    var popupTable = d3.select("body").append("table").classed("popup-table", true);

    // Append the header row for the popup table
    popupTable.append("thead").append("tr")
        .selectAll("th")
        .data(Object.keys(data[0])) // Assuming all objects in the array have the same keys
        .enter().append("th")
        .text(function (d) { return d; });

    // Append the data rows for the popup table
    var rows = popupTable.append("tbody")
        .selectAll("tr")
        .data(data)
        .enter().append("tr");

    // Populate the cells with data for the popup table
    rows.selectAll("td")
        .data(function (d) {
            return Object.keys(d).map(function (key) {
                return d[key];
            });
        })
        .enter().append("td")
        .html(function (d) { return d; });
}

// Updated getJsonFilePath function
function getJsonFilePath(clickedRowData) {
    // List of JSON files for each Grand Prix in the same order as the table data

    var grandPrixFiles = [
        "Bahrain23.json",
        "Saudi_Arabian23.json",
        "Australian23.json",
        "Azerbaijan23.json",
        "Miami23.json",
        "Monaco23.json",
        "Spanish23.json",
        "Canadian23.json",
        "Austrian23.json",
        "British23.json",
        "Hungarian23.json",
        "Belgian23.json",
        "Dutch23.json",
        "Italian23.json",
        "Singapore23.json",
        "Japanese23.json",
        "Qatar23.json",
        "United_States23.json",
        "Mexico_City23.json",
        "São_Paulo23.json",
        "Las_Vegas23.json",
        "Abu_Dhabi23.json"
    ];

    // Get the index of the clicked row in the table
    var index = firstColumnData.indexOf(clickedRowData);

    // If found, return the corresponding file path; otherwise, return null (handle this case in your application logic)
    return index !== -1 ? grandPrixFiles[index] : null;
}
