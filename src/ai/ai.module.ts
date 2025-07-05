import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './providers/ai.service';
import { AiGateway } from './ai.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import aiConfig from './config/ai.config';
import { TitlesModule } from 'src/titles/titles.module';

@Module({
  providers: [AiService, AiGateway],
  imports: [
    ConfigModule.forFeature(aiConfig),
    ConfigModule.forFeature(jwtConfig),
    AuthModule,
    TitlesModule
  ],
})
export class AiModule {}
