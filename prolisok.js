function lineCenter(position1, position2, delay) {


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

    if (delay > 0) {
        drawLineBetweenTwoLocations(centerPosition, calcPosit, heading > 0 ? '#00FF00' : '#FF0000');
    } else {
        drawLineBetweenTwoLocations(centerPosition, calcPosit, heading > 0 ? '#00F000' : '#F00000');
    }
    // addLines(centerPosition, calcPosit, heading > 0 ? '#00FF00' : '#FF0000');

}