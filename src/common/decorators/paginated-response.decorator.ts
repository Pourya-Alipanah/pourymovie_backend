import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * Decorator to apply Swagger documentation for paginated responses.
 * @param {Type<any>} model - The model type to be used in the response.
 * @return {MethodDecorator} - The method decorator that applies the Swagger documentation.
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  /**
   * Decorator that applies Swagger documentation for paginated responses.
   * It uses the provided model type to define the structure of the data in the response.
   * @param {TModel} model - The model type to be used in the response.
   * @returns {MethodDecorator} - The method decorator that applies the Swagger documentation.
   */
  return applyDecorators(
    ApiExtraModels(model, PaginationResponseDto),
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
