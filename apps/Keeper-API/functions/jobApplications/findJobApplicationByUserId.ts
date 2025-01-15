import { APIGatewayEvent, Context } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils';

import JobApplication from '../../models/JobApplication';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { userId }: { userId: string } = JSON.parse(event.body);

    // Validate that userId is provided
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'userId is required' }),
      };
    }

    // Connect to the database
    await connectToDatabase();

    // Query job applications for the user
    const jobApplications = await JobApplication.find({ userId })
      .populate('jobId') // Populate the jobId with actual job data
      .exec();

    // If no job applications are found
    if (!jobApplications || jobApplications.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'No job applications found for this user' }),
      };
    }

    console.info(`Found ${jobApplications.length} job application(s).`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        jobApplications,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error querying job applications: ${errorMessage}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
      }),
    };
  }
};
