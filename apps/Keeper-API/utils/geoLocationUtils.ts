import axios from "axios";

export const getGeoLocationFromAddress = async (address: string) => {
  const uriEncodedAddress = encodeURIComponent(address);

  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=AIzaSyB0GiWadL-4lSXe7PNO9Vr47iTC4t7C94I`
    );

    const coordinates = [res.data.results[0].geometry.location.lng, res.data.results[0].geometry.location.lat];

    return {
      type: "Point",
      coordinates,
    };
  } catch (error) {
    console.error(error);
  }
};
