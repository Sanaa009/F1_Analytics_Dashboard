

// document.addEventListener("DOMContentLoaded", function () {
//   // Function to measure the degree of rotation
//   var measureDeg = function (needle, el) {
//       var st = window.getComputedStyle(needle, null);
//       var tr = st.getPropertyValue("-webkit-transform") ||
//           st.getPropertyValue("-moz-transform") ||
//           st.getPropertyValue("-ms-transform") ||
//           st.getPropertyValue("-o-transform") ||
//           st.getPropertyValue("transform") ||
//           "fail...";

//       var values = tr.split('(')[1];
//       values = values.split(')')[0];
//       values = values.split(',');
//       var a = values[0];
//       var b = values[1];
//       var c = values[2];
//       var d = values[3];

//       var scale = Math.sqrt(a * a + b * b);

//       // arc sin, convert from radians to degrees, round
//       var sin = b / scale;
//       var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

//       el.dataset.value = angle; // Set the data-value attribute
//       el.querySelector('.number').innerText = Math.round(angle / 180 * 100); // Update the number
//   };

//   // Attach the speedometer functionality to each grid cell
//   var gridCells = document.querySelectorAll('.col-md-3');
//   gridCells.forEach(function (gridCell) {
//       var needle = gridCell.querySelector('#needle');
//       var el = gridCell.querySelector('#el');

//       // Periodically measure the degree of rotation
//       var periodicalID = setInterval(function () {
//           measureDeg(needle, el);
//       }, 10);
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  // Function to measure the degree of rotation
  var measureDeg = function (needle, el) {
      var st = window.getComputedStyle(needle, null);
      var tr = st.getPropertyValue("-webkit-transform") ||
          st.getPropertyValue("-moz-transform") ||
          st.getPropertyValue("-ms-transform") ||
          st.getPropertyValue("-o-transform") ||
          st.getPropertyValue("transform") ||
          "fail...";

      var values = tr.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];

      var scale = Math.sqrt(a * a + b * b);

      // arc sin, convert from radians to degrees, round
      var sin = b / scale;
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

      el.dataset.value = angle; // Set the data-value attribute

      // Update the element with the class 'number-display' with the data-value
      el.querySelector('.number-display').innerText = el.dataset.value;
  };

  // Attach the speedometer functionality to each grid cell
  var gridCells = document.querySelectorAll('.col-md-3');
  gridCells.forEach(function (gridCell) {
      var needle = gridCell.querySelector('#needle');
      var el = gridCell.querySelector('#el');

      // Periodically measure the degree of rotation
      var periodicalID = setInterval(function () {
          measureDeg(needle, el);
      }, 10);
  });
});
