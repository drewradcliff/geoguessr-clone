const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.API_KEY}&callback=initialize`;
script.defer = true;
script.async = true;

window.initialize = function () {
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: { lat: 37.86926, lng: -122.254811 },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    }
  );
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    streetViewControl: false,
  });

  map.addListener("click", function (e) {
    markerPosition(e.latLng, map);
  });

  let marker = undefined;
  function markerPosition(latLng, map) {
    if (marker) {
      marker.setPosition(latLng);
      map.panTo(latLng);
    } else {
      marker = new google.maps.Marker({
        position: latLng,
        map: map,
      });
      map.panTo(latLng);
    }
  }
};

document.head.appendChild(script);
