import { APIGatewayEvent, Context } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils';

import JobApplication from '../../models/JobApplication';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

// ex payload
// {
//   "employeeId": "64a58544b219fe17f06f38d8",
//   "jobId": "6785d6241bda7a0519f060a8"
// }
export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { employeeId, jobId }: { employeeId: string; jobId: string } = JSON.parse(event.body);

    // Validate that employeeId and jobId are provided
    if (!employeeId || !jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'employeeId and jobId are required' }),
      };
    }

    // Connect to the database
    await connectToDatabase();

    // Create a new job application document
    const newJobApplication = new JobApplication({
      employeeId,
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
