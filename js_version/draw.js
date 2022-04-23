function drawLine(path, color = '#FF0000') {
    var line = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
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