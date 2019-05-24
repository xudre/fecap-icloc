let map;

function initMap() {
  let fecapPos = { lat: -23.553615, lng: -46.636471 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: fecapPos,
    zoom: 15
  });

  let fecapPin = new google.maps.Marker({
    position: fecapPos,
    map: map
  });
}
