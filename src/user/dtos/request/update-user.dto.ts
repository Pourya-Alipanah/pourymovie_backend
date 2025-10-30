import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating a user.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
