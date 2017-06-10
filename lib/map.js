const Map = {
  initialize: () => {
    const usa = { lat: 37.09024, lng: -95.71289 };

    return new google.maps.Map(document.getElementById('map'), {
      center: usa,
      zoom: 4
    });
  },

  addMapMarker: (map, place) => {
    return new google.maps.Marker({
      position: place.geometry.location,
      map
    });
  },

  removeMapMarker: ({ marker }) => {
    marker.setMap(null);
  },

  addMapLine: (map, places) => {
    Map.removeMapLine();

    const coordinates = Object.keys(places).map((place) => {
      return places[place].geometry.location;
    });

    return new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map
    });
  },

  removeMapLine: (line) => {
    if (line) {
      line.setMap(null);
      line = null;
    }
  },

  findAirports: (map, query, callback) => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      query,
      type: 'airport'
    };

    service.textSearch(request, callback);
  },

  recenterMap: (map, places) => {
    const bounds = new google.maps.LatLngBounds();

    Object.keys(places).forEach((id) => {
      bounds.extend(places[id].geometry.location);
    });

    map.fitBounds(bounds);
  }
};

export default Map;
