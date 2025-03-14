import * as Joi from 'joi';
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuid } from 'uuid';

import { allowedMimes, headers } from '../../constants';
import ValidateBody from '../validateBody';

const s3 = new S3();

export const handler = async event => {
  const body = JSON.parse(event.body);

  const imageUpload = Joi.object({
    image: Joi.string().required(),
    mime: Joi.string().required(),
  });

  const isError = ValidateBody(event, imageUpload);

  if (isError) return;

  try {
    if (!allowedMimes.includes(body.mime.toLowerCase())) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'mime is not allowed ' }),
      };
    }

    const imageData = body.image;
    // if (body.image.substr(0, 7) === "base64,") {
    //   imageData = body.image.substr(7, body.image.length);
    // }
    // const buffer = Buffer.from(imageData, "base64");

    const decodedFile = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const name = uuid();
    const key = `${name}.jpeg`;

    const uploadResult = await s3.upload({
      Body: decodedFile,
      Key: key,
      ContentType: body.mime,
      Bucket: 'keeper-image-bucket',
      ACL: 'public-read',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        img: (uploadResult as any).Location,
      }),
    };
  } catch (error) {
    console.error('error', error);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: error || 'failed to upload image',
      }),
    };
  }
};
