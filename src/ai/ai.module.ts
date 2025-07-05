import { Module } from '@nestjs/common';
import { AiService } from './providers/ai.service';
import { AiGateway } from './ai.gateway';

@Module({
  providers: [AiService,AiGateway],
})
export class AiModule {}
