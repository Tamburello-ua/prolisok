let map;
let markers = [];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: new google.maps.LatLng(49.950981643157625, 36.035932992177095),
        mapTypeId: "hybrid",
    });

    map.addListener("click", (event) => {
        addMarker(event.latLng);
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
    // Adds a marker at the center of the map.
    addMarker(haightAshbury);
};

// Adds a marker to the map and push to the array.
function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        map,
    });

    markers.push(marker);
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
}