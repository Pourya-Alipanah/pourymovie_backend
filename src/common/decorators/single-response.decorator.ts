import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SingleResponseDto } from '../interceptors/data-response/dtos/single-response.dto';

/**
 * Decorator to apply Swagger documentation for single responses.
 * @param {Type<any>} model - The model type to be used in the response.
 * @return {MethodDecorator} - The method decorator that applies the Swagger documentation.
 */
export const ApiSingleResponse = <TModel extends Type<any>>(
  model: TModel,
  isArray?: boolean,
) => {
  /**
   * Defines the schema for the response data.
   * If `isArray` is true, it defines an array of the model type.
   */
  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      }
    : {
        type: 'object',
        $ref: getSchemaPath(model),
      };
  /**
   * Decorator that applies Swagger documentation for single responses.
   * It uses the provided model type to define the structure of the data in the response.
   * @param {TModel} model - The model type to be used in the response.
   * @returns {MethodDecorator} - The method decorator that applies the Swagger documentation.
   */
  return applyDecorators(
    ApiExtraModels(model, SingleResponseDto),
    ApiOkResponse({
      description: 'single response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SingleResponseDto) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
};
