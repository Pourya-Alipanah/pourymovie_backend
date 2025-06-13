import { PartialType } from '@nestjs/swagger';
import { CreateTitleDto } from './create-title.dto';

export class UpdateTitleRequestDto extends PartialType(CreateTitleDto) {}
