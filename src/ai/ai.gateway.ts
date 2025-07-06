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
  constructor(
    private readonly aiService: AiService,
    private readonly wsAuthService: WsAuthService,
  ) {}

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
