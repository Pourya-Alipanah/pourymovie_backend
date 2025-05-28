import { Injectable } from '@nestjs/common';

/**
 * HashingProvider is an abstract class that defines the interface for hashing services.
 * It provides methods to hash data and compare it against a hash.
 * Implementations of this provider can use different hashing algorithms.
 */
@Injectable()
export abstract class HashingProvider {
  /**
   * Hashes the provided data using a specific hashing algorithm.
   * @param data - The data to be hashed, can be a string or Buffer.
   * @returns A promise that resolves to the hashed string.
   */
  abstract hash(data: string | Buffer): Promise<string>;

  /**
   * Compares the provided data against a hash to verify if they match.
   * @param data - The data to compare, can be a string or Buffer.
   * @param hash - The hash to compare against.
   * @returns A promise that resolves to true if the data matches the hash, false otherwise.
   */
  abstract compare(data: string | Buffer, hash: string): Promise<boolean>;
}
