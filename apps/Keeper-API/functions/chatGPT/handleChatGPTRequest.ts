import axios from 'axios';
import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { headers } from '../../constants';
import { extractErrorMessage } from '../../keeperApiUtils';

const CHATGPT_API_KEY = process.env.VITE_CHATGPT_API_KEY;
const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.info('Starting handleChatGPTRequest lambda function');
  console.info('Event data:', JSON.stringify(event, null, 2));

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.info('Parsing request body');
    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    const MODELS = {
      // PRIMARY: 'gpt-4o',
      PRIMARY: 'gpt-3.5-turbo',
      FALLBACK: 'gpt-4o-mini',
    };

    const messages = [
      {
        role: 'system',
        content: 'You are an API that outputs JSON. Do not wrap responses in markdown or code blocks.',
      },
      { role: 'user', content: prompt },
    ];

    console.info('Received prompt:', prompt?.substring(0, 100) + (prompt?.length > 100 ? '...' : ''));

    if (!prompt || typeof prompt !== 'string') {
      console.info('Invalid prompt detected, returning 400');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid or missing "prompt".' }),
      };
    }

    // Function to hit OpenAI API
    const fetchChatCompletion = async (model: string) => {
      console.info(`Sending request to OpenAI API using model: ${model}`);
      console.info(
        'Request payload:',
        JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt.substring(0, 100) + '...' }],
          max_tokens: 1000,
          temperature: 0.2,
        }),
      );

      return axios.post(
        CHATGPT_API_URL,
        {
          model,
          messages,
          max_tokens: 1000,
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHATGPT_API_KEY}`,
          },
        },
      );
    };

    try {
      console.info(`Attempting to use primary model: ${MODELS.PRIMARY}`);
      // Try GPT-4o first
      const response = await fetchChatCompletion(MODELS.PRIMARY);

      console.info('Successfully received response from primary model');
      console.info('Response status:', response.status);
      console.info('Response snippet:', response.data.choices[0]?.message?.content?.substring(0, 100) + '...');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: response.data.choices[0]?.message?.content || 'Empty response',
        }),
      };
    } catch (error: any) {
      console.info('Error with primary model:', error.message);

      if (error.response) {
        console.info('Error response status:', error.response.status);
        console.info('Error response data:', JSON.stringify(error.response.data));
      }

      if (error.response?.data?.error?.code === 'rate_limit_exceeded') {
        console.warn('GPT-4o rate limit exceeded, switching to GPT-4o-mini...');
        console.info(`Attempting to use fallback model: ${MODELS.FALLBACK}`);

        // Try GPT-4o-mini if GPT-4o hits a rate limit
        const fallbackResponse = await fetchChatCompletion(MODELS.FALLBACK);

        console.info('Successfully received response from fallback model');
        console.info('Fallback response status:', fallbackResponse.status);
        console.info(
          'Fallback response snippet:',
          fallbackResponse.data.choices[0]?.message?.content?.substring(0, 100) + '...',
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: fallbackResponse.data.choices[0]?.message?.content || 'Empty response',
          }),
        };
      }

      // If any other error occurs, return it
      console.info('Throwing error to outer catch block');
      throw error;
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error('Error in ChatGPT API handler:', errorMessage || error);
    console.info('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process the ChatGPT request.',
        details: errorMessage,
      }),
    };
  } finally {
    console.info('Finished handling ChatGPT request');
  }
};
