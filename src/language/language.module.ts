import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './providers/language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService],
  imports: [TypeOrmModule.forFeature([Language])],
  exports: [LanguageService],
})
export class LanguageModule {}
