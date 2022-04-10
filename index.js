let map;
let line;
let infoWindow;
let markers = [];
let coords = [];
let lineColor = 0;
let soundSpeed = 331;
let sensorsTimes = [];
let boomTime;


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
        zoom: 13,
        center: new google.maps.LatLng(49.950981643157625, 36.035932992177095),
        mapTypeId: "hybrid",
    });

    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    map.addListener("click", (event) => {
        addBoom(event.latLng);

        // infoWindow.close();
        // infoWindow = new google.maps.InfoWindow({
        //     position: event.latLng,
        // });
        // infoWindow.setContent(
        //     JSON.stringify(event.latLng.toJSON(), null, 6)
        // );
        // infoWindow.open(map);
    });

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
    boomTime = Date.now();

    const boomMarker = new google.maps.Marker({
        position,
        map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    });

    boomMarker.setMap(map);

    calculateSensorTime(position);
    calculateBoomPosition();

}

function calculateSensorTime(boomPosition) {
    sensorsTimes = [];

    locations.map((position, i) => {
        var time = google.maps.geometry.spherical.computeDistanceBetween(position, boomPosition) / soundSpeed;
        sensorsTimes.push(boomTime + time);
    });
}

function calculateBoomPosition() {
    locations.map((position, i) => {
        locations.map((position2, z) => {
            if (i != z) {
                // drawLineBetweenTwoLocations(position, position2);

                var delay = sensorsTimes[i] - sensorsTimes[z];
                if (sensorsTimes[i] < sensorsTimes[z]) {
                    delay = sensorsTimes[z] - sensorsTimes[i];
                }

                lineCenter(position, position2, delay);
            }
        });
    });
}

function lineCenter(position1, position2, delay) {
    var heading = google.maps.geometry.spherical.computeHeading(position1, position2);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(position1, position2);
    var centerPosition = google.maps.geometry.spherical.computeOffset(position1, distance / 2, heading);

    drawLineBetweenTwoLocations(position1, google.maps.geometry.spherical.computeOffset(position1, distance, heading), '#0000FF');

    var val1 = (soundSpeed * delay) / distance;
    var calcHead = Math.acos(val1);

    var calcPosit = google.maps.geometry.spherical.computeOffset(centerPosition, 4000, calcHead);

    drawLineBetweenTwoLocations(centerPosition, calcPosit, '#00FF00');
}

function drawLineBetweenTwoLocations(location_1, location_2, color = '#FF0000') {
    var path = [];
    path.push(location_1);
    path.push(location_2);
    var line = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
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
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    lineColor = lineColor + 10;

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