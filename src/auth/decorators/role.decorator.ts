import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ROLE_TYPE_KEY } from '../constants/auth.constants';

export const Role = (...roleTypes: UserRole[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleTypes);
