import axios from 'axios';

export const getGeoLocationFromAddress = async (address, googleMapsApiKey) => {
  const uriEncodedAddress = encodeURIComponent(address);

  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${googleMapsApiKey}`,
    );

    const data = res.data;

    if (data.status !== 'OK' || data.results.length === 0) {
      console.error(`Geocoding API returned no results for address: ${address}`);
      return null;
    }

    const location = data.results[0].geometry.location;

    if (!location.lat || !location.lng) {
      console.error(
        `Geolocation data is missing latitude or longitude for address: ${address}. Location data: ${JSON.stringify(
          location,
        )}`,
      );
      return null;
    }

    const coordinates = [location.lng, location.lat]; // [longitude, latitude]

    return {
      type: 'Point',
      coordinates,
    };
  } catch (error) {
    console.error(`Error fetching geolocation for address: ${address}`, error);
    return null;
  }
};
