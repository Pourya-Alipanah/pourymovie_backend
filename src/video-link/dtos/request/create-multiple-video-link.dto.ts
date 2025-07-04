import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { CreateVideoLinkRequestDto } from './create-video-link.dto';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for creating multiple video links
 * This DTO is used to encapsulate an array of video link creation requests.
 */
export class CreateMultipleVideoLinkRequestDto {
  /**
   * Array of video link creation requests
   * @type {CreateVideoLinkRequestDto[]}
   */
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => CreateVideoLinkRequestDto)
  data: CreateVideoLinkRequestDto[];
}
