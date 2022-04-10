(() => {
    "use strict";
    var e = {
        d: (o, t) => {
          for (var n in t)
            e.o(t, n) &&
              !e.o(o, n) &&
              Object.defineProperty(o, n, { enumerable: !0, get: t[n] });
        },
        o: (e, o) => Object.prototype.hasOwnProperty.call(e, o),
        r: (e) => {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, {
              value: "Module",
            }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        },
      },
      o = {};
    function t() {
      const e = { lat: 49.83154325978491, lng: 36.055631135182466 },
        o = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: e,
        });
      let t = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: e,
      });
      t.open(o),
        o.addListener("click", (e) => {
          t.close(),
            (t = new google.maps.InfoWindow({ position: e.latLng })),
            t.setContent(JSON.stringify(e.latLng.toJSON(), null, 2)),
            t.open(o);
        });
    }
    e.r(o), e.d(o, { initMap: () => t });
    var n = window;
    for (var l in o) n[l] = o[l];
    o.__esModule && Object.defineProperty(n, "__esModule", { value: !0 });
  })();