import { User } from "../user.entity";

/**
 * Intersection type for user token.
 * If T is true, it includes accessToken and refreshToken.
 * If T is false, it returns the User type.
 */
export type IntersectionUserToken<T> = T extends true
  ? { accessToken: string; refreshToken: string }
  : User;
