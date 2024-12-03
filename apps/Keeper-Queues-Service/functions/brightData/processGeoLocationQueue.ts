// Import necessary modules
require('dotenv').config({ path: '../variables.env' });
import { SQSEvent } from 'aws-lambda';
import axios from 'axios';

import connectToDatabase from '../../db';
import Job from '../../models/Job';

export const handler = async (event: SQSEvent) => {
  // Ensure database connection is established
  await connectToDatabase();

  const promises = event.Records.map(async (record) => {
    try {
      // Parse the message body
      const messageBody = JSON.parse(record.body);
      const { applyLink, jobLocation } = messageBody;

      if (!applyLink || !jobLocation) {
        console.error(`Message missing applyLink or jobLocation: applyLink=${applyLink}, jobLocation=${jobLocation}`);
        return; // Skip processing this message
      }

      console.info(`Processing geolocation for applyLink: ${applyLink}, jobLocation: ${jobLocation}`);

      // Fetch geolocation data from Google Maps Geocoding API
      const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!googleMapsApiKey) {
        throw new Error('Server Error: Google Maps API key is not configured.');
      }

      const geoLocation = await getGeoLocationFromAddress(jobLocation, googleMapsApiKey);

      if (!geoLocation) {
        console.info(`No geolocation data found for jobLocation: ${jobLocation}. 
        Skipping, but here is teh message we skipped- ${messageBody}.`);
        return;
      }

      // Update the job in the database with geolocation data
      const updatedJob = await Job.findOneAndUpdate(
        { applyLink: applyLink },
        { geoLocation: geoLocation },
        { new: true }
      );

      if (updatedJob) {
        console.info(`Successfully updated applyLink: ${applyLink} with geolocation data.`);
      } else {
        console.error(`Job with applyLink: ${applyLink} not found in the database.`);
      }
    } catch (error) {
      console.error(`Error processing geolocation for record:`, error);
    }
  });

  await Promise.all(promises);
  console.info('Geolocation batch processing complete.');
};

// Helper function to get geolocation from address using Google Maps Geocoding API
const getGeoLocationFromAddress = async (address, googleMapsApiKey) => {
  const uriEncodedAddress = encodeURIComponent(address);

  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${googleMapsApiKey}`
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
          location
        )}`
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
