import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { GetPeopleRequestDto } from './dtos/response/get-people.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PersonDto } from './dtos/helper/person.dto';
import { PERSON_NOT_FOUND_ERROR } from './constants/people.errors.constants';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly paginationService: PaginationService,
  ) {}

  public async findAll(
    params?: PaginationQueryDto,
  ): Promise<GetPeopleRequestDto> {
    const queryBuilder = this.personRepository
      .createQueryBuilder('person')
      .select();
    return await this.paginationService.paginated<Person, PersonDto>(
      queryBuilder,
      params,
    );
  }

  public async findById(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['titlePersons'],
    });
    if (!person) {
      throw new NotFoundException(PERSON_NOT_FOUND_ERROR);
    }
    return person;
  }

  public async findBySlug(slug: string): Promise<Person> {
    const person = await this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.titlePersons', 'titlePerson')
      .leftJoin('titlePerson.title', 'title')
      .addSelect([
        'title.id',
        'title.titleEn',
        'title.slug',
        'title.thumbnailUrl',
      ])
      .where('person.slug = :slug', { slug })
      .getOne();

    if (!person) {
      throw new NotFoundException(PERSON_NOT_FOUND_ERROR);
    }

    return person;
  }
}
