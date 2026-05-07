/**
 * @fileoverview Centralized regex constants for form validation across the application.
 * Each regex includes a short description for clarity and reusability.
 */

export const REGEX = {
  /**
   * Matches a valid email address format.
   * - Allows alphanumeric characters, dots (.), underscores (_), and hyphens (-) before the '@'.
   * - Allows domain names with dots (.) and hyphens (-).
   * - Requires at least two letters in the domain extension (e.g., .com, .io).
   * @example "user.name@example.com"
   */
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  /**
   * Ensures no whitespace characters are present.
   * - Used for usernames, passwords, and names where spaces are not allowed.
   * @example "JohnDoe"
   */
  NO_SPACES: /^\S+$/,

  /**
   * Allows only alphabetical characters (A–Z, a–z).
   * - Disallows numbers, symbols, and whitespace.
   * - Commonly used for first and last name validation.
   * @example "Alice"
   */
  ONLY_LETTERS: /^[A-Za-z]+$/,

  /**
   * Matches either:
   * - A valid email (e.g., user@example.com), or
   * - A valid username (letters, numbers, dots, underscores; no spaces or special symbols).
   */
  EMAIL_OR_USERNAME:
    /^(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}|[a-zA-Z0-9._]+)$/,
};
