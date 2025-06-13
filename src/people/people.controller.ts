import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { PersonDto } from './dtos/helper/person.dto';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';
import { CreatePersonRequestDto } from './dtos/request/create-person.dto';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { UpdatePersonRequestDto } from './dtos/request/update-person.dto';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetPersonResponseDto } from './dtos/response/get-person.dto';

/**
 * Controller for managing people in the system.
 * Provides endpoints to create, read, update, and delete people.
 */
@Controller({ version: '1', path: 'people' })
@Auth(AuthType.Bearer)
export class PeopleController {
  /**
   * Initializes the PeopleController with the PeopleService.
   * @param peopleService - The service responsible for handling people-related operations.
   */
  constructor(private readonly peopleService: PeopleService) {}
  /**
   * Retrieves all people in the system.
   * @param peopleQuery - Optional query parameters for pagination.
   * @returns A paginated list of people.
   */
  @Get()
  @ApiOperation({
    summary: 'Get all people',
    description: 'Returns a list of all people in the system.',
  })
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(PersonDto)
  findAll(@Query() peopleQuery?: PaginationQueryDto) {
    return this.peopleService.findAll(peopleQuery);
  }

  /**
   * Retrieves a person by their unique slug.
   * @param slug - The unique identifier of the person.
   * @returns The person with the specified slug.
   */
  @Get(':slug')
  @ApiOperation({
    summary: 'Get a people by slug',
    description: 'Returns a person by their unique slug.',
  })
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetPersonResponseDto)
  findBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.peopleService.findBySlug(slug);
  }

  /**
   * create a new person in the system.
   * @param dto - The data transfer object containing the details of the person to be created.
   * @returns The created person.
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new person',
    description: 'Creates a new person in the system.',
  })
  @ApiBearerAuth('access-token')
  createPerson(@Body() dto: CreatePersonRequestDto) {
    return this.peopleService.create(dto);
  }

  /**
   * Updates an existing person in the system.
   * @param id - The unique identifier of the person to be updated.
   * @param dto - The data transfer object containing the updated details of the person.
   * @returns The updated person.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing person',
    description: 'Updates an existing person in the system.',
  })
  @ApiSingleResponse(PersonDto)
  @ApiBearerAuth('access-token')
  updatePerson(
    @Param() { id }: GetByIdParamDto,
    @Body() dto: UpdatePersonRequestDto,
  ) {
    return this.peopleService.update(id, dto);
  }

  /**
   * Deletes an existing person from the system.
   * @param id - The unique identifier of the person to be deleted.
   * @returns A response indicating the deletion was successful.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing person',
    description: 'Deletes an existing person from the system.',
  })
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePerson(@Param() { id }: GetByIdParamDto) {
    return this.peopleService.deleteById(id);
  }
}
