import { SetMetadata } from '@nestjs/common';

export const ActiveUser = (...args: string[]) => SetMetadata('active-user', args);
