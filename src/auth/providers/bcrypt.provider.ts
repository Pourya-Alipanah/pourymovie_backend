import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

/**
 * BcryptProvider is a service that implements the HashingProvider interface
 * using bcrypt for hashing and comparing strings or buffers.
 * It provides methods to hash data and compare it against a hash.
 * It uses bcrypt's genSalt and hash methods to create a secure hash,
 * and the compare method to verify if a given data matches the hash.
 * This provider can be used for securely storing passwords or other sensitive data
 * in a hashed format, ensuring that the original data is not stored directly.
 */
@Injectable()
export class BcryptProvider implements HashingProvider {
    /**
     * Hashes the provided data using bcrypt.
     * @param data - The data to be hashed, can be a string or Buffer.
     * @returns A promise that resolves to the hashed string.
     */
  public async hash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
    /**
     * Compares the provided data against a hash to verify if they match.
     * @param data - The data to compare, can be a string or Buffer.
     * @param hash - The hash to compare against.
     * @returns A promise that resolves to true if the data matches the hash, false otherwise.
     */
  public compare(data: string | Buffer, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
