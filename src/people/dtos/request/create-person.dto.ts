import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object for creating a new person.
 * This DTO is used to validate the input data when creating a new person.
 * It includes properties such as name in Persian and English,
 */
export class CreatePersonRequestDto {
  /**
   * The name of the person in Persian.
   * This property is required and must be a non-empty string.
   * @example 'جانی دپ'
   */
  @ApiProperty({
    description: 'The name of the person in Persian',
    example: 'جانی دپ',
  })
  @IsString()
  @IsNotEmpty()
  nameFa: string;

  /**
   * The name of the person in English.
   * This property is required and must be a non-empty string.
   * @example 'Johnny Depp'
   */
  @ApiProperty({
    description: 'The name of the person in English',
    example: 'Johnny Depp',
  })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  /**
   * A unique slug for the person.
   * This property is required and must be a non-empty string.
   * @example 'johnny-depp'
   */
  @ApiProperty({
    description: 'A unique slug for the person',
    example: 'johnny-depp',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  /**
   * The birth date of the person.
   * This property is optional and can be null.
   * @example '1963-06-09'
   */
  @ApiProperty({
    description: 'The birth date of the person',
    example: '1963-06-09',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  birthDate: Date | null;

  /**
   * The death date of the person.
   * This property is optional and can be null.
   * @example '2023-10-01'
   */
  @ApiProperty({
    description: 'The death date of the person',
    example: '2023-10-01',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  deathDate: Date | null;

  /**
   * The birthplace of the person.
   * This property is optional and can be null.
   * @example 'Owensboro, Kentucky, USA'
   */
  @ApiProperty({
    description: 'The birthplace of the person',
    example: 'Owensboro, Kentucky, USA',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  birthPlace: string | null;

  /**
   * The URL of the person's image.
   * This property is optional and can be null.
   * @example 'https://example.com/image.jpg'
   */
  @ApiProperty({
    description: "The URL of the person's image",
    example: 'https://example.com/image.jpg',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imageUrl: string | null;
}
