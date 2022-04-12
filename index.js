let map;
let line;
let infoWindow;
let markers = [];
let coords = [];
let lineColor = 0;
let soundSpeed = 343.1;
let sensorsTimes = [];
let boomTime;
let lines = [];


const locations = [

    { lat: 49.9595031262905, lng: 36.05364630051144 },
    { lat: 49.9578419597522, lng: 36.01864271255960 },
    // { lat: 49.9476086587322, lng: 36.02009069874675 },
    { lat: 49.9451551198959, lng: 36.04336138143805 },

    { lat: 49.95622793512991, lng: 36.16218993492612 },

];

const locations2 = [

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
    let alreadyPoint = [];

    locations.map((position, i) => {
        alreadyPoint.push(position);

        locations.map((position2, z) => {

            if (!alreadyPoint.includes(position2)) {
                // drawLineBetweenTwoLocations(position, position2);

                var delay = sensorsTimes[i] - sensorsTimes[z];
                // if (sensorsTimes[i] < sensorsTimes[z]) {
                //     delay = sensorsTimes[z] - sensorsTimes[i];
                // }
                lineCenter(position, position2, delay);
            }

        });

    });
}



function lineCenter2(position1, position2, delay) {

    if (delay > 0) {
        var heading = google.maps.geometry.spherical.computeHeading(position1, position2);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(position1, position2);
        var centerPosition = google.maps.geometry.spherical.computeOffset(position1, distance / 2, heading);

        drawLineBetweenTwoLocations(position1, google.maps.geometry.spherical.computeOffset(position1, distance, heading), '#0000FF');

        var val1 = (soundSpeed * delay) / distance;
        var calcHead = radiansToDegrees(Math.acos(val1));


        var calcPosit = google.maps.geometry.spherical.computeOffset(centerPosition, 15000, heading + 0 + calcHead);
        if (heading < 0) {
            calcPosit = google.maps.geometry.spherical.computeOffset(centerPosition, 12000, heading - calcHead)
        }

        drawLineBetweenTwoLocations(centerPosition, calcPosit, heading > 0 ? '#00FF00' : '#FF0000');
        addLines(centerPosition, calcPosit, heading > 0 ? '#00FF00' : '#FF0000');
    } else {
        var heading = google.maps.geometry.spherical.computeHeading(position1, position2);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(position1, position2);
        var centerPosition = google.maps.geometry.spherical.computeOffset(position1, distance / 2, heading);

        drawLineBetweenTwoLocations(position1, google.maps.geometry.spherical.computeOffset(position1, distance, heading), '#0000FF');

        var val1 = (soundSpeed * delay) / distance;
        var calcHead = radiansToDegrees(Math.acos(val1));


        var calcPosit = google.maps.geometry.spherical.computeOffset(centerPosition, 15000, heading + 0 + calcHead);
        if (heading < 0) {
            calcPosit = google.maps.geometry.spherical.computeOffset(centerPosition, 12000, heading - calcHead)
            drawLineBetweenTwoLocations(centerPosition, calcPosit, '#00f0f0');
        } else {
            drawLineBetweenTwoLocations(centerPosition, calcPosit, '#00f050');
        }

        addLines(centerPosition, calcPosit, '#005050');
    }
}

function addLines(location_1, location_2, color = '#FF0000') {
    var path = [];
    path.push(location_1);
    path.push(location_2);

    lines.map((position, i) => {
        if (i > 0) {
            let poiIntersect = lineIntersection(location_1.lat(), location_1.lng(), location_2.lat(), location_2.lng(),
                position[0].lat(), position[0].lng(), position[1].lat(), position[1].lng()
            )
            if (poiIntersect) {
                map.addCircle(new CircleOptions()
                    .center(poiIntersect)
                    .radius(10)
                    .strokeColor(Color.RED)
                    .fillColor(Color.BLUE));
            }
        }

    });

    lines.push(path);
}




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