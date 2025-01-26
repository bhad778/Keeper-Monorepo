import axios from 'axios';
import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import { headers } from '../../constants';
import { extractErrorMessage } from '../../keeperApiUtils';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure your API key is in the environment variables
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

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

    // Make a POST request to the OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    // Extract the response content
    const completionContent = response.data.choices[0]?.message?.content || 'Empty response from ChatGPT';

    // Return the result to the client
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: completionContent,
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
