let map;
let bounds;

let line;
let infoWindow;
let markers = [];
let coords = [];
let lineColor = 0;
let soundSpeed = 343.1;
let sensorsTimes = [];
let boomTime;
let lines = [];
let sensorsCenter;


const locations = [
    { lat: 49.9595031262905, lng: 36.05364630051144 },
    { lat: 49.9578419597522, lng: 36.01864271255960 },
    { lat: 49.9476086587322, lng: 36.02009069874675 },
    { lat: 49.9451551198959, lng: 36.04336138143805 },

    // { lat: 49.95622793512991, lng: 36.16218993492612 },
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
    getMinMaxPoints();
    initSensorsPoly();

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

let boomDiffPosition = { lat: '', lng: '' }

function calculateBoomHeading() {
    var latDelay = sensorsTimes[locations.indexOf(maxLat)] - sensorsTimes[locations.indexOf(minLat)];
    var lngDelay = sensorsTimes[locations.indexOf(maxLng)] - sensorsTimes[locations.indexOf(minLng)];

    if (latDelay > 0) {
        boomDiffPosition.lat = 'S';
    } else {
        boomDiffPosition.lat = 'N';
    }

    if (lngDelay > 0) {
        boomDiffPosition.lng = 'W';
    } else {
        boomDiffPosition.lng = 'E';
    }
}

function calculateBoomPosition() {

    calculateBoomHeading();

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

let maxLat = { lat: -90, lng: -180 };
let minLat = { lat: 90, lng: 180 };
let maxLng = { lat: -90, lng: -180 };
let minLng = { lat: 90, lng: 180 };

function getMinMaxPoints() {
    locations.map((position, i) => {

        if (position.lat > maxLat.lat) {
            maxLat = position;
        }
        if (position.lat < minLat.lat) {
            minLat = position;
        }

        if (position.lng > maxLng.lng) {
            maxLng = position;
        }
        if (position.lng < minLng.lng) {
            minLng = position;
        }
    });
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

function initSensorsPoly() {
    const sensors = new google.maps.Polygon({
        paths: locations,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });

    sensors.setMap(map);
    sensorsCenter = getCenterOfPolygon(sensors);

    new google.maps.Circle({
        center: sensorsCenter,
        map: map,
        radius: 30, // IN METERS.
        fillColor: '#00ff00',
        strokeColor: '#00ff00',

    });
}