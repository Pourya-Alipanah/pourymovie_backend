import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import aiConfig from '../config/ai.config';
import { TitlesService } from '../../titles/titles.service';

import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';

import {
  AiLinkPrompt,
  BASE_RESPONSE_PROMPT,
  BaseRequestPrompt,
} from '../constants/ai.base-prompt.constant';

import { AI_TITLE_NOT_FOUND } from '../constants/ai.errors.constant';
import {
  cleanJsonString,
  CodeBlockState,
  removeCodeBlockStreaming,
} from 'src/utils/clean-json-string';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/comment.entity';
import { Repository } from 'typeorm';

/**
 * AiService is responsible for interacting with the Google GenAI API to generate
 * movie-related responses based on user input and comments.
 * It provides methods to retrieve comments, generate summaries, and respond to user queries.
 */
@Injectable()
export class AiService {
  /**
   * Instance of GoogleGenAI to interact with the AI model.
   */
  private ai: GoogleGenAI;
  /**
   * State to manage code block detection during streaming responses.
   */
  private codeBlockState: CodeBlockState = { insideCodeBlock: false };

  /**
   * Constructs the AiService with the necessary dependencies.
   * @param aiConfiguration - Configuration for the AI service, including API key and model.
   * @param titlesService - Service to interact with movie titles.
   * @param commentRepository - Repository to manage comments in the database.
   */
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiConfiguration: ConfigType<typeof aiConfig>,
    private readonly titlesService: TitlesService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    this.ai = new GoogleGenAI({ apiKey: this.aiConfiguration.apikey! });
  }

  /**
   * Retrieves all comments for a specific title without pagination.
   * This method is useful for scenarios where all comments are needed at once.
   * @param titleId - The ID of the title for which to retrieve comments.
   * @returns An array of comments for the specified title.
   */
  public async getAllTitleCommentsWithoutPagination(
    titleId: number,
  ): Promise<Comment[] | undefined> {
    try {
      const comments = await this.commentRepository.find({
        where: { title: { id: titleId } },
        select: ['content', 'id'],
      });
      return comments;
    } catch (error) {
      console.error('Error retrieving comments:', error);
      throw error;
    }
  }

  /**
   * Generates a response stream based on the provided prompt.
   * This method uses the Google GenAI API to generate content in a streaming manner.
   * @param prompt - The prompt to send to the AI model.
   * @param onChunk - Callback function to handle each chunk of generated text.
   */
  async generateResponseStream(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const response = await this.ai.models.generateContentStream({
      model: this.aiConfiguration.model!,
      contents: prompt,
      config: {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  }


  /**
   * Retrieves a summary of comments for a specific title.
   * This method aggregates all comments and generates a summary using the AI model.
   * @param titleId - The ID of the title for which to summarize comments.
   * @param onChunk - Callback function to handle each chunk of generated summary text.
   */
  async getCommentsSummary(titleId: number, onChunk: (chunk: string) => void) {
    const comments =
      await this.getAllTitleCommentsWithoutPagination(titleId);
    if (!comments || comments.length === 0) {
      onChunk('No comments found for this title.');
      return;
    }
    const commentsArrayString = comments
      .map((comment) => `- ${comment.content}`)
      .join('\n');

    const summaryPrompt = new BaseRequestPrompt(commentsArrayString)
      .commentSummaryPrompt;

    await this.generateResponseStream(summaryPrompt, onChunk);
  }

  /**
   * Retrieves movie information based on user input.
   * This method processes the user input to extract movie titles and generates a response stream
   * with detailed information about the movie, including a link if available.
   * @param userInput - The user's input containing hints or descriptions of movies.
   * @param onChunk - Callback function to handle each chunk of generated response text.
   */
  async getMovieInfoByUserInputStream(
    userInput: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    let responseText = '';
    let resolvedTitle: string | null = null;

    const extractionPrompt = new BaseRequestPrompt(userInput);

    await this.generateResponseStream(extractionPrompt.chatPrompt, (chunk) => {
      responseText += chunk;
      const cleanedChunk = removeCodeBlockStreaming(chunk, this.codeBlockState);
      if (cleanedChunk) {
        onChunk(cleanedChunk);
      }
    });

    try {
      const cleaned = cleanJsonString(responseText);
      const parsed = JSON.parse(cleaned);

      if (parsed?.movies?.length > 0) {
        resolvedTitle = parsed.movies[0];
      }
    } catch (e) {
      return;
    }
    if (!resolvedTitle) {
      onChunk(AI_TITLE_NOT_FOUND);
      return;
    }

    const cleaned = cleanJsonString(responseText);
    const parsed = JSON.parse(cleaned);

    const link =
      await this.titlesService.findTitleLinkBySlugCandidate(resolvedTitle);

    let finalPrompt = BASE_RESPONSE_PROMPT;
    if (link) {
      finalPrompt += new AiLinkPrompt(
        true,
        resolvedTitle,
        parsed?.userLanguage,
        link,
      ).prompt;
    } else {
      finalPrompt += new AiLinkPrompt(
        false,
        resolvedTitle,
        parsed?.userLanguage,
      ).prompt;
    }

    await this.generateResponseStream(finalPrompt, onChunk);
  }

  /**
   * Generates a movie summary based on user input.
   * This method uses the AI model to create a detailed summary of the movie,
   * including genre, key details, and a direct link if available.
   * @param userInput - The user's input containing hints or descriptions of movies.
   * @param onChunk - Callback function to handle each chunk of generated summary text.
   */
  async getMovieSummary(userInput: string, onChunk: (chunk: string) => void) {
    const extractionPrompt = new BaseRequestPrompt(userInput).summaryPrompt;
    await this.generateResponseStream(extractionPrompt, (chunk) => {
      onChunk(chunk);
    });
  }
}
