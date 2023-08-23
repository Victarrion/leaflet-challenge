

 // Map generating code
let myMap = L.map("map", {
    center: [40.01, -95.71],
    zoom: 4.4
});
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function markerSize(magnitud) {
    return Math.sqrt(magnitud) * 50000;
  }


d3.json(baseURL).then(function(response) {
    


    // Create a new marker cluster group.
    let data=response.features

    let markers = L.markerClusterGroup();
    // Loop through the data.
    for (let i = 0; i < data.length; i++) {
        
      // Set the data location property to a variable.
        let location = data[i].geometry;
       
        // Check for the location property.
        if (location) {
        
        let colors = "";
            if (location.coordinates[2] <= 10 && location.coordinates[2]>= -10) {
              colors = "green";
            }
            else if (location.coordinates[2] <= 30 && location.coordinates[2]> 10) {
              colors = "tan";
            }
            else if (location.coordinates[2] <= 50 && location.coordinates[2]>= 30) {
              colors = "yellow";
            }
            else if (location.coordinates[2] <= 70 && location.coordinates[2]>= 50) {
                colors = "orange";
            }
            else if (location.coordinates[2] <= 90 && location.coordinates[2]>= 70) {
                colors = "brown";
            }
            else {
              colors = "red";
            }


        // Add a new marker to the cluster group, and bind a popup.
            let latlon=[location.coordinates[1],location.coordinates[0]];

            // markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]]).bindPopup(data[i].properties.title));
        
            L.circle(latlon, {
                fillOpacity: 0.75,
                color: colors,
            
                // Setting our circle's radius to equal the output of our markerSize() function:
                // This will make our marker's size proportionate to its population.
                radius: markerSize(data[i].properties.mag)
              }).bindPopup(`<h3>${data[i].properties.title} at a depth of ${location.coordinates[2]}<h3>`).addTo(myMap);
        }
        
    }
  
    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);
    


    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];
    // Add the minimum and maximum.
    let legendInfo = "Earthquake Depth";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  });

 





