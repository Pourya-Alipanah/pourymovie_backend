import { forwardRef, Module } from '@nestjs/common';
import { SeasonService } from './providers/season.service';
import { SeasonController } from './season.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from 'src/season/season.entity';
import { TitlesModule } from 'src/titles/titles.module';

@Module({
  providers: [SeasonService],
  controllers: [SeasonController],
  imports: [TypeOrmModule.forFeature([Season]), forwardRef(() => TitlesModule)],
  exports: [SeasonService],
})
export class SeasonModule {}
