import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CONFIRM_PASSWORD_DOES_NOT_MATCH_ERROR } from 'src/user/constants/users.errors.constants';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
/**
 * Custom validation constraint to check if the password and confirm password match.
 * This is used in user registration and password reset scenarios.
 * @class MatchPasswordConstraint
 * @implements {ValidatorConstraintInterface}
 */
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === confirmPassword;
  }
  defaultMessage(args: ValidationArguments) {
    return CONFIRM_PASSWORD_DOES_NOT_MATCH_ERROR;
  }
}
