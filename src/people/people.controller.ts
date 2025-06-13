import { Controller, Get, Param, Query } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { PersonDto } from './dtos/helper/person.dto';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';

@Controller({ version: '1', path: 'people' })
@Auth(AuthType.Bearer)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
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

  @Get(':slug')
  @ApiOperation({
    summary: 'Get all people',
    description: 'Returns a list of all people in the system.',
  })
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(PersonDto)
  findBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.peopleService.findBySlug(slug);
  }
}
