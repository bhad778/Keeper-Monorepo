import { APIGatewayEvent, Context } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as Joi from 'joi';
import * as pdfjsLib from 'pdfjs-dist';
import { Readable } from 'stream';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Resume from '../../models/Resume';
import { extractErrorMessage } from '../../keeperApiUtils';

console.info('Initializing resume retrieval Lambda function');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.VITE_RESUME_BUCKET;
const PRESIGNED_URL_EXPIRATION = 3600; // 1 hour in seconds

// Helper function to convert stream to buffer
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  console.info('Converting stream to buffer');
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => {
      console.info(`Received chunk of size ${chunk.length}`);
      chunks.push(chunk);
    });
    stream.on('error', error => {
      console.error('Error in stream conversion:', error);
      reject(error);
    });
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      console.info(`Stream conversion complete. Total buffer size: ${buffer.length} bytes`);
      resolve(buffer);
    });
  });
};

// Alternative PDF text extraction using pdf.js
const extractPdfText = async (pdfBuffer: Buffer): Promise<string> => {
  console.info(`Starting PDF text extraction for buffer of size ${pdfBuffer.length} bytes`);
  try {
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    console.info(`PDF loaded. Total pages: ${pdf.numPages}`);

    // Extract text from all pages
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.info(`Extracting text from page ${pageNum}`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      console.info(`Page ${pageNum} text length: ${pageText.length}`);

      fullText += pageText + '\n';
    }

    const trimmedText = fullText.trim();
    console.info(`PDF text extraction complete. Total text length: ${trimmedText.length}`);
    return trimmedText;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract PDF text');
  }
};

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.info('Resume retrieval Lambda function started');
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      console.warn('Missing request body');
      throw new Error('Missing request body.');
    }

    console.info('Parsing request body');
    const getResumeSchema = Joi.object({
      employeeId: Joi.string().required(),
      shouldReturnText: Joi.boolean().default(false),
    });

    const { error } = getResumeSchema.validate(JSON.parse(event.body));

    if (error) {
      console.warn(`Validation error: ${error.message}`);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: `Validation error: ${error.message}`,
        }),
      };
    }

    const { employeeId, shouldReturnText } = JSON.parse(event.body);
    console.info(`Processing resume retrieval for employeeId: ${employeeId}`);

    // Connect to the database
    console.info('Connecting to database');
    await connectToDatabase();
    console.info('Database connection established');

    // Find the resume for the employee
    console.info(`Searching for resume with employeeId: ${employeeId}`);
    const resume = await Resume.findOne({ employeeId });

    if (!resume) {
      console.warn(`No resume found for employeeId: ${employeeId}`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Resume not found for this employee',
        }),
      };
    }

    console.info('Resume found. Preparing S3 file retrieval');

    // Extract the key from the S3 URL
    const fileUrl = resume.fileUrl;
    const key = fileUrl.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, '');
    console.info(`Extracted S3 key: ${key}`);

    // Generate presigned URL
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    console.info('Generating presigned URL');
    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: PRESIGNED_URL_EXPIRATION,
    });
    console.info('Presigned URL generated successfully');

    // Get the PDF file from S3
    console.info('Retrieving file from S3');
    const s3Response = await s3Client.send(getObjectCommand);

    let resumeText = '';
    let pdfInfo: any = {};

    // Check if Body exists and is a readable stream
    if (s3Response.Body && shouldReturnText) {
      try {
        console.info('Extracting text from PDF');
        // Convert stream to buffer
        const dataBuffer = await streamToBuffer(s3Response.Body as Readable);

        // Extract text using pdf.js
        resumeText = await extractPdfText(dataBuffer);

        // Provide some basic PDF metadata
        pdfInfo = {
          size: dataBuffer.length,
          type: 'PDF',
        };

        console.info('Successfully extracted text from PDF');
      } catch (pdfError) {
        console.error('Error extracting text from PDF:', pdfError);
        resumeText = 'Error extracting text from PDF. Please try downloading the original file.';
      }
    }

    console.info('Preparing successful response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          resumeInfo: resume,
          downloadUrl: presignedUrl,
          resumeText: resumeText,
        },
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Unexpected error in resume retrieval: ${errorMessage}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage || 'An unexpected error occurred.',
      }),
    };
  } finally {
    console.info('Resume retrieval Lambda function completed');
  }
};
