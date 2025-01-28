import { postRequest } from './serviceUtils';

const ChatGPTService = {
  /**
   * Sends a prompt to the ChatGPT API via keeper-api and returns the response.
   * @param prompt The prompt to send to ChatGPT.
   * @returns A promise resolving to the ChatGPT response.
   */
  handleChatGPTRequest: (prompt: string) => postRequest<string>('handleChatGPTRequest', { prompt }),
};

export default ChatGPTService;
