const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.API_KEY}&callback=initialize`;
script.defer = true;
script.async = true;

let panorama;
let map;
let streetViewCoordinates;

window.initialize = () => {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view")
  );
  tryLocation(handleCallback);

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    streetViewControl: false,
  });

  map.addListener("click", function (e) {
    addGuessMarker(e.latLng, map);
  });
};
document.head.appendChild(script);

const tryLocation = (callback) => {
  const sv = new google.maps.StreetViewService();
  sv.getPanorama(
    {
      location: getRandomCoordinates(),
      radius: 50000,
    },
    callback
  );
};

const handleCallback = (data, status) => {
  if (status === "OK") {
    panorama.setPano(data.location.pano);
    panorama.setPov({
      heading: 270,
      pitch: 0,
    });
    panorama.setOptions({
      disableDefaultUI: true,
    });
    panorama.setVisible(true);
  } else {
    tryLocation(handleCallback);
  }
};

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
  guessButton.textContent = "Choose Location";
  guessButton.id = "guessButton";
  guessButton.onclick = addStreetViewMarker;
  let div = document.querySelector("#wrapper");
  div.append(guessButton);
};

let streetViewMarker;
const addStreetViewMarker = () => {
  streetViewMarker = new google.maps.Marker({
    position: panorama.location.latLng,
    map: map,
  });
  // TODO: map.panTo(latLng);
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

const getRandomCoordinates = () => {
  return { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 };
};
