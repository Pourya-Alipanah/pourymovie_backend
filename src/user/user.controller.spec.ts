import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./providers/users.service";
import { GetUsersResponseDto } from './dtos/response/get-users.dto';

describe('UserController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersResponse: GetUsersResponseDto = {
    paginated: true,
    data: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updateAt: null,
        deletedAt: null,
        hasSubscription: false,
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    ],
    meta: {
      itemsPerPage: 10,
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
    },
    links: {
      first: '/users?page=1',
      previous: null,
      current: '/users?page=1',
      next: null,
      last: '/users?page=1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAllUsers: jest.fn().mockResolvedValue(mockUsersResponse),
          },
        },
        {
          provide: 'PaginationService',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const result = await controller.getUsers();
      expect(result).toEqual(mockUsersResponse);
      expect(usersService.findAllUsers).toHaveBeenCalled();
    });
  });
});
