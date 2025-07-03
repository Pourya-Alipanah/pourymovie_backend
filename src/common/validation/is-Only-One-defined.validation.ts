import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOnlyOneDefined(
  property1: string,
  property2: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'onlyOneDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const hasProp1 =
            obj[property1] !== undefined && obj[property1] !== null;
          const hasProp2 =
            obj[property2] !== undefined && obj[property2] !== null;
          return (hasProp1 || hasProp2) && !(hasProp1 && hasProp2);
        },
        defaultMessage(args: ValidationArguments) {
          return `Exactly one of '${property1}' or '${property2}' must be defined`;
        },
      },
    });
  };
}
