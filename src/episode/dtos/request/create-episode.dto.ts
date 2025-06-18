import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateEpisodeRequestDto {
  /**
   * Number of the episode in the series
   * @type {number}
   */
  @ApiProperty({
    description: 'Number of the episode in the series',
    name: 'episodeNumber',
    type: 'number',
  })
  @IsInt()
  @IsNotEmpty()
  episodeNumber: number;

  /**
   * video links associated with the episode
   * This array contains multiple video links for different qualities or sources.
   * @type {number}
   */
  @ApiProperty({
    description: 'season id associated with the episode',
    name: 'seasonId',
    type: 'number',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  seasonId: number;
}
