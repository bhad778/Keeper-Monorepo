import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils';

import JobApplication from '../../models/JobApplication';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { userId, jobId }: { userId: string; jobId: string } = JSON.parse(event.body);

    // Validate that userId and jobId are provided
    if (!userId || !jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'userId and jobId are required' }),
      };
    }

    // Connect to the database
    await connectToDatabase();

    // Create a new job application document
    const newJobApplication = new JobApplication({
      userId,
      jobId,
    });

    // Save the job application
    await newJobApplication.save();

    console.info('Job application created successfully.');

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Job application created successfully',
        newJobApplication,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error creating job application: ${errorMessage}`);
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
