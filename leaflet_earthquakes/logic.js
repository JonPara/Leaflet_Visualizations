// Store API endpoint inside queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to query the URL
d3.json(queryUrl, function(data){
    // Once we get a reponse, send the data.features object to the createFeatures function
    createFeatures(data.features);

});

function createFeatures(earthquakeData){


    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" +
            new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    createMap(eathquakes)
}

function createMap(earthquakes) {

    // Define streetmap layer
    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoiam9ucGFyYSIsImEiOiJjamh2NDdwZ2IwMW9vM3BvOXY5djB1ZTZ1In0.Tzo65-TaaZdI1Jcwq5Q9Zg" +
    "T6YbdDixkOBWH_k9GbS8JQ")

    // Define a baseMaps objects to hold the base layer
    var baseMaps = {
        "Street Map": streetMap
    };

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create the map giving the map and earthquake layers to display when page is first loaded
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [streetMap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
};
