import { Module } from '@nestjs/common';
import { SeasonService } from './providers/season.service';
import { SeasonController } from './season.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from 'src/season/season.entity';

@Module({
  providers: [SeasonService],
  controllers: [SeasonController],
  imports: [TypeOrmModule.forFeature([Season])],
})
export class SeasonModule {}
