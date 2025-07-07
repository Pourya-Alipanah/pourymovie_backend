import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { AiService } from './providers/ai.service';
import { TitleSummaryRequestDto } from './dtos/request/title-summary.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Controller for AI-related functionalities.
 * This controller provides endpoints to stream comments summary and movie summaries.
 * It uses Server-Sent Events (SSE) to stream data to the client.
 */
@Controller({ version: '1', path: 'ai' })
export class AiController {
  /**
   * Constructs the AiController with the necessary dependencies.
   * @param aiService - Service to interact with AI functionalities.
   */
  constructor(private readonly aiService: AiService) {}

  /**
   * Streams the summary of comments for a specific title.
   * @param id - The ID of the title for which to stream comments summary.
   * @returns An observable that emits chunks of the comments summary.
   */
  @ApiOperation({
    summary: 'Stream comments summary for a specific title',
    description: 'Streams the summary of comments for a given title ID.',
  })
  @Get('comments-summary/:id')
  @Sse()
  async streamCommentsSummary(
    @Param() { id }: GetByIdParamDto,
  ): Promise<Observable<any>> {
    return new Observable<any>((observer) => {
      this.aiService
        .getCommentsSummary(id, (chunk) => {
          observer.next({ chunk });
        })
        .then(() => observer.complete());
    });
  }

  /**
   * Streams the summary of a movie based on its title.
   * @param name - The name of the movie title for which to stream the summary.
   * @returns An observable that emits chunks of the movie summary.
   */
  @ApiOperation({
    summary: 'Stream movie summary by title name',
    description: 'Streams the summary of a movie based on its title.',
  })
  @Post('title-summary')
  @Sse()
  async streamSummary(
    @Body() { name }: TitleSummaryRequestDto,
  ): Promise<Observable<any>> {
    return new Observable<any>((observer) => {
      this.aiService
        .getMovieSummary(name, (chunk) => {
          observer.next({ chunk });
        })
        .then(() => observer.complete());
    });
  }
}
