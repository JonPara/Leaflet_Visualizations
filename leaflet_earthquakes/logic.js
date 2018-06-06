// Store API endpoint inside queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to query the URL
d3.json(queryUrl, function(data){
    // Once we get a reponse, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

// Create a function that takes in the queried URL. The function locates the key/value pair and manipulates the HTML
// to add each bubble where the earthquake occurred.
function createFeatures(earthquakeData){
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(features, layer){
            layer.bindPopup("<h3>Magintude: " + features.properties.mag + "</h3><h3>Location: " + 
            features.properties.place + new Date(features.properties.time) + "</p>");
        },

// Add properties to the circle
    pointToLayer: function(feature, latlng){
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
    // Have a map created based on the variable above
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap layer
    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoiam9ucGFyYSIsImEiOiJjamh4aXplemMwY2FiM3dscmgyYWx2cnA2In0.EkbMLM9pydlSlE8pBTjxLA")

    // Define a satellite layer
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoiam9ucGFyYSIsImEiOiJjamh4aXplemMwY2FiM3dscmgyYWx2cnA2In0.EkbMLM9pydlSlE8pBTjxLA")

    // Define a dark map layer
    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidGJlcnRvbiIsImEiOiJjamRoanlkZXIwenp6MnFuOWVsbGo2cWhtIn0.zX40X0x50dpaN96rKQKarw." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    // Define a baseMaps objects to hold the base layer
    var baseMaps = {
        "Street Map": streetMap,
        "Satellite Map": satelliteMap,
        "Dark Map": darkMap
    };

    // Create layer for tectonic plates
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create the map giving the map and earthquake layers to display when page is first loaded
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMap, satelliteMap, earthquakes, tectonicPlates]
    });

    // Add fault lines to map
    d3.json(tectPlatesUrl, function(tectPlateData){

        L.geoJson(tectPlateData,{
            color: "orange",
            weight: 3
        })
        .addTo(tectonicPlates);
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    var legend = L.control({position: 'bottomleft'})

       legend.onAdd = function(myMap){
        var div = L.DomUtil.create("div", "info legend");
            grades = [0, 1, 2, 3, 4, 5];
            labels = [];

        for (var i = 0; i < grades.length; i++){
            div.innerHTML += '<i style = "background":' + getColor(grades[i] + 1) + '"></i>' + 
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : "+");
        }
        return div;
    };
    legend.addTo(myMap);

};
    // Fill in the color of the legend based on the "grade" variable
    function getColor(d){
        return d === 5 ? "#cc0000":
        d === 4 ? "#ccc100":
        d === 3 ? "#0066cc":
        d === 2 ? "#005fcc":
        d === 1 ? "#7600cc":
                 "#ffcca5";
    }

    // Create the radius for the circle
    function getRadius(value){
        return value*25000
    }