/**
 * Base prompt for extracting movie titles from user input.
 */
export class BaseRequestPrompt {
  prompt: string;
  constructor(userInput: string) {
    this.prompt = `You are a movie expert. Extract the movie name(s) in English from the user input. Reply ONLY with JSON in this format:
            {
              "movies": ["Movie Title 1", "Movie Title 2"]
            }
            User input: "{${userInput}}"
            `;
  }
}

/**
 * Base prompt for AI service.
 */
export const BASE_RESPONSE_PROMPT = `You are a knowledgeable and critical movie expert. For every request you receive, respond in the same language as the input. However, always search for movie titles in English. Provide the user with the link to the movie if it exists in the database, along with a summary, genre, and various details about the film. If the movie is not found in the database, still give a detailed explanation and provide the IMDb link.
`;

/**
 * AI Link Prompt for movie information requests.
 * @param foundLink - Indicates if the movie link was found.
 * @param title - The title of the movie.
 * @param link - The link to the movie (optional).
 */
export class AiLinkPrompt {
  prompt: string;
  constructor(foundLink: boolean, title: string, link?: string) {
    if (foundLink) {
      this.prompt = `The user requested info about the movie "${title}". Here is the link: ${link}. Provide a summary, genre, and details.`;
    } else {
      this.prompt = `The movie "${title}" is not found in the database. Provide a detailed explanation and the IMDb link.`;
    }
  }
}
