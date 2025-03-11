import { APIGatewayEvent, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Resume from '../../models/Resume';
import { extractErrorMessage } from '../../keeperApiUtils';

const s3 = new S3();
const BUCKET_NAME = process.env.VITE_RESUME_BUCKET || 'keeper-resume-bucket';
const PRESIGNED_URL_EXPIRATION = 3600; // 1 hour in seconds

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getResumeSchema = Joi.object({
      employeeId: Joi.string().required(),
    });

    const { error } = getResumeSchema.validate(JSON.parse(event.body));
    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: `Validation error: ${error.message}`,
        }),
      };
    }

    const { employeeId } = JSON.parse(event.body);

    // Connect to the database
    await connectToDatabase();

    // Find the resume for the employee
    const resume = await Resume.findOne({ employeeId });

    if (!resume) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Resume not found for this employee',
        }),
      };
    }

    // Extract the key from the S3 URL
    const fileUrl = resume.fileUrl;
    const key = fileUrl.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');

    // Generate a presigned URL for temporary access
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: PRESIGNED_URL_EXPIRATION,
    };

    const presignedUrl = s3.getSignedUrl('getObject', params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          resumeInfo: resume,
          downloadUrl: presignedUrl,
        },
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error retrieving resume: ${errorMessage}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage || 'An unexpected error occurred.',
      }),
    };
  }
};
