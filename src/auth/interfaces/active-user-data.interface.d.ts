import { UserRole } from 'src/user/enums/user-role.enum';

/**
 * Interface representing the active user data
 * used in authentication processes.
 */
interface ActiveUserData {
  /**
   * The ID of the user
   */
  sub: number;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's Role
   */
  role: UserRole;
}
