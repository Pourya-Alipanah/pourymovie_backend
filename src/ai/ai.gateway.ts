import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@WebSocketGateway({
  namespace: '/ai',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@Auth(AuthType.Bearer) 
export class AiGateway /* implements OnGatewayConnection, OnGatewayDisconnect  */{
  /* handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  } */
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Received message:', payload);
    
    return 'Hello world!';
  }
}
