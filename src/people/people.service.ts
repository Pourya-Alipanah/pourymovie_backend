import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { Repository, In } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { GetPeopleRequestDto } from './dtos/response/get-people.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PersonDto } from './dtos/helper/person.dto';
import {
  PERSON_NOT_FOUND_ERROR,
  SOME_PEOPLE_NOT_FOUND_ERROR,
} from './constants/people.errors.constants';
import { CreatePersonRequestDto } from './dtos/request/create-person.dto';
import { UpdatePersonRequestDto } from './dtos/request/update-person.dto';
import { GetPersonResponseDto } from './dtos/response/get-person.dto';
import slugify from 'slugify';
import { UploadFromEntity } from 'src/upload-center/enums/upload-from-entity.enum';
import { UploadType } from 'src/upload-center/enums/upload-type.enum';
import { UploadCenterService } from 'src/upload-center/providers/upload-center.service';

/**
 * Service for managing people in the system.
 * Provides methods to create, read, update, and delete people.
 * This service interacts with the database through the Person entity.
 * It also handles pagination for lists of people.
 */
@Injectable()
export class PeopleService {
  /**
   * Initializes the PeopleService with the Person repository and pagination service.
   * @param personRepository - The repository for the Person entity.
   * @param paginationService - The service responsible for handling pagination.
   */
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly paginationService: PaginationService,
    private readonly uploadCenterService: UploadCenterService,
  ) {}

  /**
   * Retrieves all people in the system with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns A paginated list of people.
   */
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

  /**
   * Retrieves a person by their unique ID.
   * @param id - The unique identifier of the person.
   * @returns The person with the specified ID.
   * @throws NotFoundException if the person is not found.
   */
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

  /**
   * Retrieves multiple people by their unique IDs.
   * @param ids - An array of unique identifiers for the people.
   * @returns An array of people with the specified IDs.
   */
  public async findMultipleById(ids: number[]): Promise<Person[]> {
    const uniqueIds = Array.from(new Set(ids));
    const person = await this.personRepository.find({
      where: { id: In(uniqueIds) },
    });
    if (person.length < uniqueIds.length) {
      throw new NotFoundException(SOME_PEOPLE_NOT_FOUND_ERROR);
    }
    return person;
  }

  /**
   * Retrieves a person by their unique slug.
   * @param slug - The unique identifier of the person.
   * @returns The person with the specified slug.
   * @throws NotFoundException if the person is not found.
   */
  public async findBySlug(slug: string): Promise<GetPersonResponseDto> {
    const person = await this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.titlePersons', 'titlePerson')
      .leftJoin('titlePerson.title', 'title')
      .addSelect([
        'title.id',
        'title.titleEn',
        'title.slug',
        'title.thumbnailUrl',
        'title.type',
      ])
      .where('person.slug = :slug', { slug })
      .getOne();

    if (!person) {
      throw new NotFoundException(PERSON_NOT_FOUND_ERROR);
    }

    return person as unknown as Promise<GetPersonResponseDto>;
  }

  /**
   * Deletes a person by their unique ID.
   * @param id - The unique identifier of the person to be deleted.
   * @throws NotFoundException if the person is not found.
   */
  public async deleteById(id: number): Promise<void> {
    const { affected } = await this.personRepository.delete(id);
    if (!affected) {
      throw new NotFoundException(PERSON_NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new person in the system.
   * @param personDto - The data transfer object containing the details of the person to be created.
   * @returns The created person.
   */
  public async create(personDto: CreatePersonRequestDto): Promise<Person> {
    let imageUrl: string | null = null;
    if (personDto.imageUrl) {
      const url = await this.uploadCenterService.confirmUpload(
        personDto.imageUrl.key,
        UploadFromEntity.PERSON,
        UploadType.COVER,
      );

      imageUrl = url;
    }
    return await this.personRepository.save({
      ...personDto,
      slug: slugify(personDto.slug),
      imageUrl,
    });
  }

  /**
   * Updates an existing person in the system.
   * @param id - The unique identifier of the person to be updated.
   * @param personDto - The data transfer object containing the updated details of the person.
   * @returns The updated person.
   * @throws NotFoundException if the person is not found.
   */
  public async update(
    id: number,
    personDto: UpdatePersonRequestDto,
  ): Promise<Person> {
    const existingPerson = await this.findById(id);
    let imageUrl: string | null = existingPerson.imageUrl;
    if (personDto.imageUrl) {
      const url = await this.uploadCenterService.confirmUpload(
        personDto.imageUrl.key,
        UploadFromEntity.PERSON,
        UploadType.COVER,
      );

      imageUrl = url;
    }
    const updatedPerson = Object.assign(existingPerson, {
      ...personDto,
      slug: slugify(personDto.slug || existingPerson.slug),
      imageUrl,
    });
    return await this.personRepository.save(updatedPerson);
  }
}
