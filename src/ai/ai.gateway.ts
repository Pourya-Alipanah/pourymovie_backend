import { UseFilters, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { WsAuthExceptionFilter } from './ws-auth-exception.filter';
import {
  GENERAL_ERROR_MESSAGE,
  INVALID_PAYLOAD_TITLE_ID,
  WS_AUTH_ERROR,
} from './constants/ai.errors.constant';
import { WsAuthService } from '../auth/providers/ws-auth.service';
import { AiService } from './providers/ai.service';
import { EventKeys } from './enums/event-keys.enum';

/**
 * AiGateway is a WebSocket gateway that handles real-time communication
 * for AI-related functionalities, such as movie information retrieval and summaries.
 * It uses guards and filters to manage authentication and error handling.
 */
@WebSocketGateway({
  namespace: '/ai',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Cookie'],
  },
})
@UseFilters(WsAuthExceptionFilter)
@UseGuards(AuthenticationGuard)
export class AiGateway implements OnGatewayConnection {
  /**
   * Constructs the AiGateway with the necessary dependencies.
   * @param aiService - Service to interact with AI functionalities.
   * @param wsAuthService - Service to handle WebSocket authentication.
   */
  constructor(
    private readonly aiService: AiService,
    private readonly wsAuthService: WsAuthService,
  ) {}

  /**
   * Handles new WebSocket connections.
   * Validates the client using the wsAuthService.
   * If validation fails, emits an error event and disconnects the client.
   * @param client - The WebSocket client connection.
   */
  async handleConnection(client: any) {
    const valid = await this.wsAuthService.validateClient(client);

    if (!valid) {
      client.emit(EventKeys.WS_AUTH_ERROR_EVENT_KEY, {
        message: WS_AUTH_ERROR,
      });
      client.disconnect();
      return;
    }
  }

  /**
   * Handles incoming messages from the client.
   * Processes user input to retrieve movie information and emits responses.
   * If an error occurs, emits a general error event.
   * @param client - The WebSocket client connection.
   * @param payload - The message payload containing user input.
   */
  @SubscribeMessage(EventKeys.SUBSCRIBE_AI_EVENT_KEY)
  async handleMessage(client: any, payload: any): Promise<void> {
    try {
      const userMessage = payload;

      await this.aiService.getMovieInfoByUserInputStream(
        userMessage,
        (chunk: string) => {
          client.emit(EventKeys.SUBSCRIBE_AI_RESPONSE_EVENT_KEY, {
            chunk,
          });
        },
      );

      client.emit(EventKeys.SUBSCRIBE_AI_END_RESPONSE_EVENT_KEY);
    } catch (error) {
      client.emit(EventKeys.GENERAL_ERROR_EVENT_KEY, {
        message: GENERAL_ERROR_MESSAGE,
        error,
      });
    }
  }

  /**
   * Handles requests for movie summaries.
   * Uses the AI service to generate a summary based on user input.
   * Emits the summary in chunks and handles errors appropriately.
   * @param client - The WebSocket client connection.
   * @param payload - The message payload containing user input for the summary.
   */
  @SubscribeMessage(EventKeys.SUBSCRIBE_AI_SUMMARY_EVENT_KEY)
  async handleSummary(client: any, payload: any): Promise<void> {
    try {
      const userMessage = payload;

      await this.aiService.getMovieSummary(userMessage, (chunk: string) => {
        client.emit(EventKeys.SUBSCRIBE_AI_SUMMARY_RESPONSE_EVENT_KEY, {
          chunk,
        });
      });

      client.emit(EventKeys.SUBSCRIBE_AI_END_RESPONSE_EVENT_KEY);
    } catch (error) {
      client.emit(EventKeys.GENERAL_ERROR_EVENT_KEY, {
        message: GENERAL_ERROR_MESSAGE,
        error,
      });
    }
  }

  /**
   * Handles requests for comments summary.
   * Uses the AI service to generate a summary of comments based on a title ID.
   * Emits the summary in chunks and handles errors appropriately.
   * @param client - The WebSocket client connection.
   * @param payload - The message payload containing the title ID for comments summary.
   */
  @SubscribeMessage(EventKeys.SUBSCRIBE_AI_COMMENTS_SUMMARY_EVENT_KEY)
  async handleCommentsSummary(client: any, payload: any): Promise<void> {
    try {
      if (Number.isNaN(payload)) {
        client.emit(EventKeys.GENERAL_ERROR_EVENT_KEY, {
          message: INVALID_PAYLOAD_TITLE_ID,
        });
        return;
      }
      const userMessage = +payload;

      await this.aiService.getCommentsSummary(userMessage, (chunk: string) => {
        client.emit(
          EventKeys.SUBSCRIBE_AI_COMMENTS_SUMMARY_RESPONSE_EVENT_KEY,
          {
            chunk,
          },
        );
      });

      client.emit(EventKeys.SUBSCRIBE_AI_END_RESPONSE_EVENT_KEY);
    } catch (error) {
      client.emit(EventKeys.GENERAL_ERROR_EVENT_KEY, {
        message: GENERAL_ERROR_MESSAGE,
        error,
      });
    }
  }
}
