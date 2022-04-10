let map;
let line;
let markers = [];
let coords = [];



const locations = [
    { lat: 49.9540742, lng: 36.0369246 },
    { lat: 49.9603253, lng: 36.0490527 },
    { lat: 49.9578316, lng: 36.0185946 },
    { lat: 49.9547282, lng: 36.0161483 },
    { lat: 49.9557036, lng: 36.0290861 },
    { lat: 49.9619766, lng: 36.0308433 },
    { lat: 49.9468981, lng: 36.0208795 },
    { lat: 49.9490706, lng: 36.0438466 },

];

let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",

});

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(49.950981643157625, 36.035932992177095),
        mapTypeId: "hybrid",
    });

    map.addListener("click", (event) => {
        addMarker(event.latLng);

        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: event.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(event.latLng.toJSON(), null, 6)
        );
        infoWindow.open(map);

    });
    // add event listeners for the buttons
    document
        .getElementById("show-markers")
        .addEventListener("click", showMarkers);
    document
        .getElementById("hide-markers")
        .addEventListener("click", hideMarkers);
    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);

};

function initMarkers() {
    locations.map((position, i) => {
        addMarker(position);
    });
}

function drawLine() {
    line = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
}

function removeLine() {
    line.setMap(null);
}


// Adds a marker to the map and push to the array.
function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        map,
    });

    markers.push(marker);
    coords.push(position);

    drawLine();
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    hideMarkers();
    markers = [];
    coords = [];
    removeLine();
}