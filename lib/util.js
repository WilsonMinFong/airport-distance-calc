const Util = {
  // utilizes haversine formula to calulate shortest distance over
  // the earth's surface
  // http://www.movable-type.co.uk/scripts/latlong.html
  calculateNauticalDistance: (location1, location2) => {
    const { lat1, lon1, lat2, lon2 } = {
      lat1: location1.geometry.location.lat(),
      lon1: location1.geometry.location.lng(),
      lat2: location2.geometry.location.lat(),
      lon2: location2.geometry.location.lng(),
    };

    const R = 3440; // nautical miles
    const φ1 = Util.toRadians(lat1);
    const φ2 = Util.toRadians(lat2);
    const Δφ = Util.toRadians(lat2-lat1);
    const Δλ = Util.toRadians(lon2-lon1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  toRadians: (degree) => {
    return degree * (Math.PI / 180);
  }
};

export default Util;
