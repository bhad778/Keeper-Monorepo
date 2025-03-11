import { APIGatewayEvent, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Resume from '../../models/Resume';
import { extractErrorMessage } from '../../keeperApiUtils';

// List of allowed file types
const allowedMimeTypes = ['application/pdf'];

const s3 = new S3();
const BUCKET_NAME = process.env.VITE_RESUME_BUCKET || '';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
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

    const { error } = uploadResumeSchema.validate(JSON.parse(event.body));
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

    const { employeeId, fileName, fileData, mimeType } = JSON.parse(event.body);

    // Decode the base64 file data
    const decodedFile = Buffer.from(fileData.replace(/^data:application\/pdf;base64,/, ''), 'base64');

    // Generate a unique file name
    const uniqueFileName = `${uuid()}-${fileName.replace(/\s+/g, '_')}`;
    const key = `resumes/${employeeId}/${uniqueFileName}`;

    // Upload file to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: decodedFile,
      ContentType: mimeType,
    };

    // Create a manual promise wrapper for the s3.upload method
    const uploadResult: any = await new Promise((resolve, reject) => {
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    // Connect to the database
    await connectToDatabase();

    // Import Employee model
    const Employee = require('../../models/Employee').default;

    // Update employee record to indicate they have a resume
    await Employee.findByIdAndUpdate(employeeId, {
      'settings.hasResume': true,
    });

    // Check if a resume already exists for this employee
    const existingResume = await Resume.findOne({ employeeId });

    if (existingResume) {
      // If a resume exists, update it
      existingResume.fileUrl = uploadResult.Location;
      existingResume.fileName = fileName;
      existingResume.uploadDate = new Date();
      await existingResume.save();

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
      // If no resume exists, create a new entry
      const newResume = new Resume({
        employeeId,
        fileUrl: uploadResult.Location,
        fileName,
      });

      await newResume.save();

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
