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