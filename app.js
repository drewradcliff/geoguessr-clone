const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.API_KEY}&callback=initialize`;
script.defer = true;
script.async = true;

const locations = [{ lat: 37.86926, lng: -122.254811 }];
let map;
let markerCoordinates;
let streetViewCoordinates = locations[0];

window.initialize = () => {
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: streetViewCoordinates,
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    }
  );
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 3,
    streetViewControl: false,
  });

  map.addListener("click", function (e) {
    addGuessMarker(e.latLng, map);
  });
};

document.head.appendChild(script);

let marker = undefined;
const addGuessMarker = (latLng, map) => {
  if (marker) {
    marker.setPosition(latLng);
    map.panTo(latLng);
  } else {
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    map.panTo(latLng);
    addButton();
  }
};

const addButton = () => {
  let guessButton = document.createElement("button");
  guessButton.textContent = "Guess";
  guessButton.id = "guessButton";
  guessButton.onclick = addStreetViewMarker;
  let div = document.querySelector("#wrapper");
  div.append(guessButton);
};

let streetViewMarker;
const addStreetViewMarker = () => {
  streetViewMarker = new google.maps.Marker({
    position: streetViewCoordinates,
    map: map,
  });
  // map.panTo(latLng);
  drawPolyLine(marker, streetViewMarker);
  calculateDistance(marker, streetViewMarker);
};

const drawPolyLine = (mk1, mk2) => {
  const line = new google.maps.Polyline({
    path: [mk1.position, mk2.position],
  });
  line.setMap(map);
};

function calculateDistance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  console.log(d);
  return d;
}
