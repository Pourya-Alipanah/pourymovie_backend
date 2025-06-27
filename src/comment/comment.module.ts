import { Module } from '@nestjs/common';
import { CommentService } from './providers/comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { TitlesModule } from 'src/titles/titles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), TitlesModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
