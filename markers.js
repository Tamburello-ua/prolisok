function initMarkers() {
    locations.map((position, i) => {
        addMarker(position);
    });
}


function addMarker(position) {
    const marker = new google.maps.Marker({
        position,
        map,
    });

    markers.push(marker);
    coords.push(position);

    // drawLine();
    if (coords.length > 1) {
        var infowindowL = new google.maps.InfoWindow({
            content: ""
        });

        var prevPosition = coords[coords.length - 2];
        var description = google.maps.geometry.spherical.computeDistanceBetween(position, prevPosition);
        bindInfoWindow(marker, map, infowindowL, "" + description);
    }
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