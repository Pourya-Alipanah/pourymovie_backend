import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TitlesService {
  constructor(
    @InjectRepository(Title)
    private readonly titleRepository: Repository<Title>,
  ) {}

  public async findById(id: number): Promise<Title | null> {
    return this.titleRepository.findOne({
      where: { id },
      relations: [
        'genres',
        'country',
        'seasons',
        'videoLinks',
        'titlePersons',
        'titlePersons.person',
        'comments',
        'comments.user',
        'language',
      ],
    });
  }
}
