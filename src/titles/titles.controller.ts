import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { TitlesService } from './titles.service';

@Controller({ version: '1', path: 'titles' })
export class TitlesController {
  constructor(private readonly titlesServise: TitlesService) {}

  @Get('/:id')
  @Auth(AuthType.None)
  getTitleById(@Param('id') id: number) {
    // Logic to get title by ID
    return this.titlesServise.findById(id);
  }
}
