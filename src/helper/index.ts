import crypto from 'node:crypto'
import type * as deepl from 'deepl-node'

/**
 * Converts an array of strings into a unique SHA-256 hash.
 *
 * @param arr - The array of strings to be hashed.
 * @returns The hexadecimal representation of the SHA-256 hash.
 */
export function arrayToUniqueHash(arr: string[]) {
  // Concatenate all strings in the array
  const concatenatedString = arr.join('')

  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256')

  // Update the hash with the concatenated string
  hash.update(concatenatedString)

  // Get the hexadecimal representation of the hash
  const hashHex = hash.digest('hex')

  return hashHex
}

/**
 * Converts a given string to a unique SHA-256 hash.
 *
 * @param str - The input string to be hashed.
 * @returns The hexadecimal representation of the SHA-256 hash.
 */
export function stringToUniqueHash(str: string) {
  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256')

  // Update the hash with the concatenated string
  hash.update(str)

  // Get the hexadecimal representation of the hash
  const hashHex = hash.digest('hex')

  return hashHex
}

/**
 * Sanitizes the given language code by removing any regional variant.
 *
 * @param sourceLanguage - The language code to sanitize. It can be a `deepl.LanguageCode` or `null`.
 * @returns The sanitized language code as `deepl.SourceLanguageCode` or `null` if the input is `null`.
 */
export function sanitizeLanguageCode(sourceLanguage: deepl.LanguageCode | null): deepl.SourceLanguageCode | null {
  if (!sourceLanguage) {
    return null
  }

  if (sourceLanguage.includes('-')) {
    return sourceLanguage.split('-')[0] as deepl.SourceLanguageCode
  }

  return sourceLanguage as deepl.SourceLanguageCode
}
