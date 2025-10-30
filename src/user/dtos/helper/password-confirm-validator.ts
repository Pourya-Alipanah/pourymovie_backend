import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CONFIRM_PASSWORD_DOES_NOT_MATCH_ERROR } from 'src/user/constants/users.errors.constants';

/**
 * Custom validation constraint to check if the password and confirm password match.
 * This is used in user registration and password reset scenarios.
 * @class MatchPasswordConstraint
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  /**
   * Validates that the confirm password matches the original password.
   * @param {string} confirmPassword - The confirm password to validate.
   * @param {ValidationArguments} args - The validation arguments containing the object being validated.
   * @returns {boolean} - Returns true if the passwords match, false otherwise.
   */
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === confirmPassword;
  }
  /**
   * Returns the default error message when validation fails.
   * @param {ValidationArguments} args - The validation arguments containing the object being validated.
   * @returns {string} - The error message indicating that the passwords do not match.
   */
  defaultMessage(args: ValidationArguments) {
    return CONFIRM_PASSWORD_DOES_NOT_MATCH_ERROR;
  }
}
