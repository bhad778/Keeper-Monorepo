import { APIGatewayEvent, Context } from 'aws-lambda';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Resume from '../../models/Resume';
import { extractErrorMessage } from '../../keeperApiUtils';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.VITE_RESUME_BUCKET;
console.info('Using S3 bucket:', BUCKET_NAME || 'No bucket name specified!');

if (!BUCKET_NAME) {
  console.error('VITE_RESUME_BUCKET environment variable is not set');
}

// List of allowed file types
const allowedMimeTypes = ['application/pdf'];

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.info('Handler invoked with event:', {
    method: event.httpMethod,
    path: event.path,
    bodyLength: event.body ? event.body.length : 0,
  });

  try {
    // Validate request body
    if (!event.body) {
      console.info('Missing request body');
      throw new Error('Missing request body.');
    }

    const uploadResumeSchema = Joi.object({
      employeeId: Joi.string().required(),
      fileName: Joi.string().required(),
      fileData: Joi.string().required(), // Base64 encoded file
      mimeType: Joi.string()
        .valid(...allowedMimeTypes)
        .required(),
    });

    const requestBody = JSON.parse(event.body);
    console.info('Request payload validation starting');

    const { error } = uploadResumeSchema.validate(requestBody);
    if (error) {
      console.info('Validation error:', error.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: `Validation error: ${error.message}`,
        }),
      };
    }
    console.info('Request payload validation successful');

    const { employeeId, fileName, fileData, mimeType } = requestBody;
    console.info('Processing resume for employee:', employeeId);
    console.info('File name:', fileName);
    console.info('File type:', mimeType);
    console.info('File data length:', fileData.length);

    // Check if fileData starts with expected prefix
    const hasExpectedPrefix = fileData.startsWith('data:application/pdf;base64,');
    console.info('File data has expected prefix:', hasExpectedPrefix);

    // Decode the base64 file data
    const decodedFile = Buffer.from(fileData.replace(/^data:application\/pdf;base64,/, ''), 'base64');
    console.info('Decoded file size (bytes):', decodedFile.length);

    // Generate a unique file name
    const uniqueFileName = `${uuid()}-${fileName.replace(/\s+/g, '_')}`;
    const key = `resumes/${employeeId}/${uniqueFileName}`;
    console.info('Generated S3 key:', key);

    // Check if bucket name exists
    if (!BUCKET_NAME) {
      console.error('S3 bucket name is not configured');
      throw new Error('S3 bucket name is not configured. Please check VITE_RESUME_BUCKET environment variable.');
    }

    // Prepare S3 upload parameters
    const uploadParams: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: decodedFile,
      ContentType: mimeType,
    };
    console.info('S3 upload params:', {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType,
      BodyLength: decodedFile.length,
    });

    // Create upload command and send to S3
    console.info('Starting S3 upload');
    const command = new PutObjectCommand(uploadParams);

    try {
      const uploadResult = await s3Client.send(command);
      console.info('S3 upload result:', uploadResult);
    } catch (uploadError) {
      console.error('S3 upload error:', uploadError);
      throw uploadError;
    }
    console.info('S3 upload completed successfully');

    // Construct the file URL manually since AWS SDK v3 doesn't return it directly
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.info('Constructed file URL:', fileUrl);

    // Connect to the database
    console.info('Connecting to database');
    await connectToDatabase();
    console.info('Database connection established');

    // Import Employee model
    console.info('Importing Employee model');
    const Employee = require('../../models/Employee').default;

    // Update employee record to indicate they have a resume
    console.info('Updating employee record');
    await Employee.findByIdAndUpdate(employeeId, {
      'settings.hasResume': true,
    });
    console.info('Employee record updated successfully');

    // Check if a resume already exists for this employee
    console.info('Checking for existing resume');
    const existingResume = await Resume.findOne({ employeeId });

    if (existingResume) {
      console.info('Found existing resume, updating');
      // If a resume exists, update it
      existingResume.fileUrl = fileUrl;
      existingResume.fileName = fileName;
      existingResume.uploadDate = new Date();
      await existingResume.save();
      console.info('Resume updated successfully');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Resume updated successfully',
          data: existingResume,
        }),
      };
    } else {
      console.info('No existing resume found, creating new record');
      // If no resume exists, create a new entry
      const newResume = new Resume({
        employeeId,
        fileUrl,
        fileName,
      });

      await newResume.save();
      console.info('New resume record created successfully');

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Resume uploaded successfully',
          data: newResume,
        }),
      };
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error(`Error uploading resume: ${errorMessage}`);

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
