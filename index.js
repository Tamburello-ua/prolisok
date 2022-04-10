let map;
let line;
let markers = [];
let coords = [];
let lineColor = 0;


const locations = [
    { lat: 49.9595031262905, lng: 36.05364630051144 },
    { lat: 49.9504873054103, lng: 36.04173748576215 },
    { lat: 49.9548533753193, lng: 36.03667952306620 },
    { lat: 49.9578419597522, lng: 36.01864271255960 },
    { lat: 49.9550369299292, lng: 36.01688556554387 },
    { lat: 49.9476086587322, lng: 36.02009069874675 },
    { lat: 49.9493699660205, lng: 36.03096957578924 },
    { lat: 49.9451551198959, lng: 36.04336138143805 },

];



function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(49.950981643157625, 36.035932992177095),
        mapTypeId: "hybrid",
    });

    let infoWindow = new google.maps.InfoWindow({
        content: "",
    });

    // map.addListener("click", (event) => {
    //     addMarker(event.latLng);

    //     // Close the current InfoWindow.
    //     infoWindow.close();
    //     // Create a new InfoWindow.
    //     infoWindow = new google.maps.InfoWindow({
    //         position: event.latLng,
    //     });
    //     infoWindow.setContent(
    //         JSON.stringify(event.latLng.toJSON(), null, 6)
    //     );
    //     infoWindow.open(map);

    // });

    map.addListener("click", (event) => {
        addBoom(event.latLng);

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

    initMarkers();

};

function addBoom(position) {
    const boomMarker = new google.maps.Marker({
        position,
        map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    });

    boomMarker.setMap(map);



    // bindInfoWindow(marker, map, infowindow, description);
}

function initMarkers() {
    locations.map((position, i) => {
        addMarker(position);
    });
}

function drawLine() {
    line = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#' + lineColor + '0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    lineColor = lineColor + 20;

    line.setMap(map);
}

function removeLine() {
    line.setMap(null);
}

function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        map,
    });

    markers.push(marker);
    coords.push(position);

    drawLine();
    if (coords.length > 1) {
        var description = computeDistanceBetween(position, coords[coords.length - 1]);
    }

    bindInfoWindow(marker, map, infowindow, description);
}

function bindInfoWindow(marker, map, infowindow, description) {
    marker.addListener('click', function() {
        infowindow.setContent(description);
        infowindow.open(map, this);
    });
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function hideMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
    coords = [];
    removeLine();
}