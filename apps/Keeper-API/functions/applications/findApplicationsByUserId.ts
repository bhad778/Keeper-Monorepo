import { APIGatewayEvent, Context } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils';

import Application from '../../models/Application';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

// ex payload
// {
//   "employeeId": "64a58544b219fe17f06f38d8",
// }
export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { employeeId }: { employeeId: string } = JSON.parse(event.body);

    // Validate that employeeId is provided
    if (!employeeId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'employeeId is required' }),
      };
    }

    // Connect to the database
    await connectToDatabase();

    // Query job applications for the user
    const applications = await Application.find({ employeeId })
      .populate('jobId') // Populate the jobId with actual job data
      .exec();

    console.info(`Found ${applications.length} job application(s).`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: applications,
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
