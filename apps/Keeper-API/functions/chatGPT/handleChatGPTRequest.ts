import axios from 'axios';
import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { headers } from '../../constants';
import { extractErrorMessage } from '../../keeperApiUtils';

const CHATGPT_API_KEY = process.env.VITE_CHATGPT_API_KEY;
const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

const MODELS = {
  PRIMARY: 'gpt-4o',
  FALLBACK: 'gpt-4o-mini',
};

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid or missing "prompt".' }),
      };
    }

    // Function to hit OpenAI API
    const fetchChatCompletion = async (model: string) => {
      return axios.post(
        CHATGPT_API_URL,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
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
      // Try GPT-4o first
      const response = await fetchChatCompletion(MODELS.PRIMARY);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: response.data.choices[0]?.message?.content || 'Empty response' }),
      };
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'rate_limit_exceeded') {
        console.warn('GPT-4o rate limit exceeded, switching to GPT-4o-mini...');

        // Try GPT-4o-mini if GPT-4o hits a rate limit
        const fallbackResponse = await fetchChatCompletion(MODELS.FALLBACK);
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
      throw error;
    }
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
