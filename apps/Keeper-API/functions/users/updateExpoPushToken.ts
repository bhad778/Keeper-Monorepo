import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils';

import connectToDatabase from '../../db';
import Employee from '../../models/Employee';
import { headers } from '../../constants';
import Employer from '../../models/Employer';
import Job from '../../models/Job';
import { TMatch } from '../../types/globalTypes';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { accountType, expoPushToken, id } = JSON.parse(event.body);

    if (!accountType || !expoPushToken || !id) {
      throw new Error('Missing required fields: accountType, expoPushToken, or id.');
    }

    await connectToDatabase();

    if (accountType === 'employer') {
      const savedEmployer = await updateEmployerExpoPushToken(id, expoPushToken);
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(savedEmployer),
      });
    } else if (accountType === 'employee') {
      const savedEmployee = await updateEmployeeExpoPushToken(id, expoPushToken);
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(savedEmployee),
      });
    } else {
      throw new Error('Invalid account type. Must be "employer" or "employee".');
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in updateExpoPushToken:', errorMessage || error);
    return callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: errorMessage || 'An unexpected error occurred.' }),
    });
  }
};

// Helper function to update employer's expo push token
const updateEmployerExpoPushToken = async (employerId: string, expoPushToken: string) => {
  const employerObject = await Employer.findById(employerId).exec();
  if (!employerObject) {
    throw new Error(`Employer with ID ${employerId} not found.`);
  }

  employerObject.expoPushToken = expoPushToken;
  employerObject.markModified('expoPushToken');

  // Update jobs owned by the employer
  await Job.updateMany({ ownerId: employerId }, { $set: { expoPushToken } });

  // Update matches in jobs and employees
  const employersJobs = await Job.find({ ownerId: employerId });
  const otherMatchesIdsArray: any = employersJobs.flatMap(job =>
    job?.matches?.map((match: TMatch) => ({
      employeeId: match.custom.employeeId,
      matchId: match.id,
    })),
  );

  if (!otherMatchesIdsArray) {
    throw new Error(`Employer with ID ${employerId} not found.`);
  }

  for (const { employeeId, matchId } of otherMatchesIdsArray) {
    const employee = await Employee.findById(employeeId).exec();
    if (employee) {
      const matchIndex = employee?.matches?.findIndex(match => match.id === matchId);
      if (matchIndex !== -1 && matchIndex !== undefined && employee && employee.matches) {
        employee.matches[matchIndex].custom.expoPushToken = expoPushToken;
        employee.markModified('matches');
        await employee.save();
      }
    }
  }

  return employerObject.save();
};

// Helper function to update employee's expo push token
const updateEmployeeExpoPushToken = async (employeeId: string, expoPushToken: string) => {
  const employeeObject = await Employee.findById(employeeId).exec();
  if (!employeeObject) {
    throw new Error(`Employee with ID ${employeeId} not found.`);
  }

  employeeObject.expoPushToken = expoPushToken;
  employeeObject.markModified('expoPushToken');

  // Update matches in jobs
  const otherMatchesIdsArray = employeeObject?.matches?.map((match: TMatch) => ({
    jobId: match.custom.jobId,
    matchId: match.id,
  }));

  if (!otherMatchesIdsArray) {
    throw new Error(`otherMatchesIdsArray is undefined for employee with ID ${employeeId}.`);
  }

  for (const { jobId, matchId } of otherMatchesIdsArray) {
    const job = await Job.findById(jobId).exec();
    if (job) {
      const matchIndex = job?.matches?.findIndex(match => match.id === matchId);
      if (matchIndex !== -1 && matchIndex !== undefined && job && job.matches) {
        job.matches[matchIndex].custom.expoPushToken = expoPushToken;
        job.markModified('matches');
        await job.save();
      }
    }
  }

  return employeeObject.save();
};
