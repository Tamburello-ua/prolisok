function lineIntersection(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {

    //  Fail if either line is undefined.
    if (Ax === Bx && Ay === By || Cx === Dx && Cy === Dy) return false;

    //  Fail if the segments share an end-point.
    if (Ax === Cx && Ay === Cy || Bx === Cx && By === Cy ||
        Ax === Dx && Ay === Dy || Bx === Dx && By === Dy) {
        return false;
    }

    //  (1) Translate the system so that point A is on the origin.
    Bx -= Ax;
    By -= Ay;
    Cx -= Ax;
    Cy -= Ay;
    Dx -= Ax;
    Dy -= Ay;

    //  Discover the length of segment A-B.
    var distAB = Math.sqrt(Bx * Bx + By * By);

    //  (2) Rotate the system so that point B is on the positive X axis.
    var theCos = Bx / distAB;
    var theSin = By / distAB;
    var newX = Cx * theCos + Cy * theSin;
    Cy = Cy * theCos - Cx * theSin;
    Cx = newX;
    newX = Dx * theCos + Dy * theSin;
    Dy = Dy * theCos - Dx * theSin;
    Dx = newX;

    //  Fail if segment C-D doesn't cross line A-B.
    if (Cy < 0. && Dy < 0. || Cy >= 0. && Dy >= 0.) return false;

    //  (3) Discover the position of the intersection point along line A-B.
    var ABpos = Dx + (Cx - Dx) * Dy / (Dy - Cy);

    //  Fail if segment C-D crosses line A-B outside of segment A-B.
    if (ABpos < 0. || ABpos > distAB) return false;

    //  (4) Apply the discovered position to line A-B in the original coordinate system.
    var X = (Number(Ax) + ABpos * theCos);
    var Y = Ay + ABpos * theSin;

    //  Success.
    // var countryCircle = new google.maps.Circle({
    //     center: new google.maps.LatLng(X, Y),
    //     radius: 10,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.35,
    //     map: map
    // });
    // // addMarker(new google.maps.LatLng(X, Y));
    // countryCircle.setMap(map)


    return google.maps.LatLng(X, Y);
    // return { x: X, y: Y };

}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}


function getCenterOfPolygon(polygon) {
    var PI = 22 / 7;
    var X = 0;
    var Y = 0;
    var Z = 0;
    polygon.getPath().forEach(function(vertex, inex) {
        lat1 = vertex.lat();
        lon1 = vertex.lng();
        lat1 = lat1 * PI / 180;
        lon1 = lon1 * PI / 180;
        X += Math.cos(lat1) * Math.cos(lon1);
        Y += Math.cos(lat1) * Math.sin(lon1);
        Z += Math.sin(lat1);
    });
    Lon = Math.atan2(Y, X);
    Hyp = Math.sqrt(X * X + Y * Y);
    Lat = Math.atan2(Z, Hyp);
    Lat = Lat * 180 / PI;
    Lon = Lon * 180 / PI;
    return new google.maps.LatLng(Lat, Lon);
}