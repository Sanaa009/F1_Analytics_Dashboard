# F1 Fanalytics Dashboard


## Overview

The F1 Racing Dashboard is a comprehensive and innovative endeavor, designed to meet the analytical needs of Formula 1 enthusiasts, strategists, and analysts. The visually compelling and user-friendly interface unravels the intricate layers of Formula 1 dynamics, focusing on four key performance indicators (KPIs): Rating, Race Viewership, Total Fanbase, and Stock Price.

The color scheme, inspired by the official F1 Racing Organization, uses a harmonious blend of red, black, and white, establishing a seamless connection with the sport's authoritative presence.

## Key Features

1. **Animated Line Charts:**
   - Displays performance trends for the top 5 F1 drivers across various races.

2. **Interactive Bar Chart:**
   - Showcases team standings with a dropdown for specific years, offering an interactive exploration of historical data.

3. **Choropleth Map:**
   - Reveals viewership patterns for Grand Prix events globally, providing insights into the popularity of races in different regions.

4. **3D Globe:**
   - Allows users to select a race track and visualize its trajectory, offering a unique and immersive experience.

5. **Coxcomb Chart:**
   - Details the top driver's data for a specific year, providing a comprehensive overview of individual performance.

## Technological Stack

Built on a robust stack including HTML, CSS, Bootstrap, JavaScript, D3.js, and React, the dashboard seamlessly integrates data from F1 official reports, Wikipedia, and Kaggle datasets, ensuring accuracy and reliability.

## Additional Information

**Data Sources:**
- F1 official reports (https://www.formula1.com/)
- Wikipedia
- Kaggle datasets (https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020)

**Files Included in the Project:**
- **bar sub.html**: HTML file for a bar chart subsection
- **bar.css**: Cascading Style Sheet for the bar chart
- **bar.html**: HTML file for the bar chart
- **choro.css**: Cascading Style Sheet for choropleth map
- **choropleth.html**: HTML file for the choropleth map
- **coxcomb sub.html**: HTML file for a coxcomb chart subsection
- **coxcomb.css**: Cascading Style Sheet for the coxcomb chart
- **coxcomb.html**: HTML file for the coxcomb chart
- **d3.min.js**: Minified version of the D3.js library
- **data**: Directory containing various data files
  - **austria23.csv**: CSV file containing data for Austria in 2023
  - **Constructor_Standing.csv**: CSV file containing constructor standings data
  - **cox.csv**: CSV file with Cox data
  - **rank_data.csv**: CSV file with ranking data
  - **viewers.csv**: CSV file with viewer statistics
  - **data1.json**: JSON file with additional data
- **geojsons**: Directory containing GeoJSON files
  - **cox.json**: Cox-related GeoJSON file
  - **f1-circuits.geojson**: GeoJSON file with F1 circuits data
  - **f1-locations.json**: GeoJSON file with F1 locations data
  - **pole.json**: JSON file with pole data
  - **Race_Classification.json**: JSON file with race classifications
  - **standings.json**: JSON file with standings data
  - **world-atlas.json**: JSON file with world atlas data
  - **world.geojson**: GeoJSON file for the world map
- **index.html**: Main HTML file
- **line sub.html**: HTML file for a line chart subsection
- **line.css**: Cascading Style Sheet for the line chart
- **line.html**: HTML file for the line chart
- **map.css**: Cascading Style Sheet for maps
- **map.html**: HTML file for maps
- **nav.css**: Cascading Style Sheet for navigation
- **nav.html**: HTML file for navigation
- **node_modules**: Directory containing Node.js modules
- **package-lock.json**: Auto-generated file for npm dependencies
- **package.json**: Configuration file for npm packages
- **reset.css**: CSS file for resetting default styles
- **static**: Directory for static files
  - **bg.jpeg**: Background image file
  - **drivers**: Directory related to driver information
  - **f1_logo.svg**: SVG file for the F1 logo
  - **flags**: Directory for flag images
  - **font**: Directory for font files
  - **track.png**: Image file for a track
- **sim sub.html**: HTML file for a simulation subsection
- **sim.css**: Cascading Style Sheet for the simulation
- **sim.html**: HTML file for the simulation
- **static**: Directory for static files
- **style.css**: Cascading Style Sheet for general styling
- **table sub.html**: HTML file for a table subsection
- **table.css**: Cascading Style Sheet for the table
- **table.html**: HTML file for the table


**Demonstration Instructions**
Please use Live Server for viewing the website. For best experience of the dashboard, use chrome with 100 % window view.

```bash
npm install    #install js libraries
npm run serve  #starts server on port 2000
```

