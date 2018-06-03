// Store API endpoint inside queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to query the URL
d3.json(queryUrl, function(data){
    // Once we get a reponse, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(Feature, layer){
            layer.bindPopup("<h3>Magintude: " + feature.properties.mag + "</h3><h3>Location: " + 
            feature.properties.place + new Date(feature.properties.time) + "</p>");
        },

    pointToLayer: function(eatuer, latlng){
        return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
        })
    }
    });

    createMap(earthquakes);
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
        "Earthquakes": earthquakes
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

    var legend = L.control({position: 'bottomright'})

       legend.onAdd = function(myMap){
        var div = L.DomUntil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < grades.length; i++){
            div.innerHTML += '<i style = "background":' + getColor(grades[i] + 1) + '"></i>' + 
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : "+");
        }
        return div;
    };
    legend.addTo(myMap);
};

    function getColor(d){
        return d > 5 ? "#a545000":
        d > 4 ? "#cc5500":
        d > 3 ? "#ff6f08":
        d > 2 ? "#ff9143":
        d > 1 ? "#ffb37e":
                 "#ffcca5";
    }

    function getRadius(value){
        return value*25000
    }