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

      const response =
        await this.aiService.getMovieInfoByUserInput(userMessage);

      client.emit(EventKeys.SUBSCRIBE_AI_RESPONSE_EVENT_KEY, {
        text: response,
      });
    } catch (error) {
      client.emit(EventKeys.GENERAL_ERROR_EVENT_KEY, {
        message: GENERAL_ERROR_MESSAGE,
        error
      });
    }
  }
}
