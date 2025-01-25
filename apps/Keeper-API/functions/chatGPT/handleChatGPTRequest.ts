import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';

import { headers } from '../../constants';
import { extractErrorMessage } from '../../keeperApiUtils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Make sure your API key is in your environment variables
});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Parse the request body to get the prompt
    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid or missing "prompt" in request body.',
        }),
      };
    }

    // Call OpenAI with the given prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    // Return the result to the client
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        headers,
        data: response.choices[0]?.message?.content || 'Empty response from ChatGPT',
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in ChatGPT API handler:', errorMessage || error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process the ChatGPT request.', details: errorMessage }),
    };
  }
};
