import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WS_AUTH_ERROR } from './constants/ai.errors.constant';
import { EventKeys } from './enums/event-keys.enum';

/**
 * Exception filter for handling WebSocket authentication errors.
 * This filter catches WsException and emits an error message to the client,
 * then disconnects the client from the WebSocket connection.
 */
@Catch(WsException)
export class WsAuthExceptionFilter implements WsExceptionFilter {
  /**
   * Handles the exception by emitting an error message to the client
   * and disconnecting the client from the WebSocket connection.
   * @param {WsException} exception - The exception thrown during WebSocket authentication.
   * @param {ArgumentsHost} host - The arguments host containing the WebSocket context.
   */
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client: Socket = ctx.getClient<Socket>();

    client.emit(EventKeys.WS_AUTH_ERROR_EVENT_KEY, { message: WS_AUTH_ERROR });

    client.disconnect();
  }
}
