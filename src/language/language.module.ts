import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './providers/language.service';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService]
})
export class LanguageModule {}
