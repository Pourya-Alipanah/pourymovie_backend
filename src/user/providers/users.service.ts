import { Injectable } from '@nestjs/common';
import {
  GetUsersDto,
  GetUsersResponseDto,
} from '../dtos/response/get-users.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * UserService
 * @description This service is responsible for handling user-related logic.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService
   * @param {PaginationService} paginationService - Service for handling pagination
   * @param {Repository<User>} usersRepository - Repository for user entity
   */
  constructor(
    // inject pagination service
    private readonly paginationService: PaginationService,

    //inject users repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Fetches all users with pagination
   * @param {PaginationQueryDto} params - Pagination parameters
   * @returns {Promise<GetUsersResponseDto>} - Paginated list of users
   */
  async findAllUsers(params?: PaginationQueryDto): Promise<GetUsersResponseDto> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select();

    const result = await this.paginationService.paginated<GetUsersDto>(
      queryBuilder,
      params,
    );
    return result;
  }
}
