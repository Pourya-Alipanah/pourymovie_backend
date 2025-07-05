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

import {
  AI_TITLE_NOT_FOUND,
  FAILED_JSON_PARSE,
} from '../constants/ai.errors.constant';
import { cleanJsonString } from 'src/utils/clean-json-string';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiConfiguration: ConfigType<typeof aiConfig>,
    private readonly titlesService: TitlesService,
  ) {
    this.ai = new GoogleGenAI({ apiKey: this.aiConfiguration.apikey! });
  }

  async generateResponse(prompt: string): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
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
    
    return response.text;
  }
  
  async extractMovieTitlesFromUserInput(userInput: string): Promise<string[]> {
    const extractionPrompt = new BaseRequestPrompt(userInput);
    
    const responseText = await this.generateResponse(extractionPrompt.prompt);
    
    try {
      const cleaned = cleanJsonString(responseText ?? '');
      const json = JSON.parse(cleaned);
      return json.movies || [];
    } catch (e) {
      console.error(FAILED_JSON_PARSE, responseText, e);
      return [];
    }
  }

  async getMovieInfoByUserInput(
    userInput: string,
  ): Promise<string | undefined> {
    const movieTitles = await this.extractMovieTitlesFromUserInput(userInput);

    
    if (movieTitles.length === 0) {
      return AI_TITLE_NOT_FOUND;
    }
    
    const title = movieTitles[0];
    
    const link = await this.titlesService.findTitleLinkBySlugCandidate(title);
    console.log(link);

    let prompt = BASE_RESPONSE_PROMPT;

    if (link) {
      prompt += new AiLinkPrompt(true, title, link).prompt;
    } else {
      prompt += new AiLinkPrompt(false, title).prompt;
    }

    return this.generateResponse(prompt);
  }
}
