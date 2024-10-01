
/**
 * @module PasswordValidator
 * 
 * This module provides a PasswordValidator class that allows for customizable
 * password validation rules. Users can define minimum and maximum length, 
 * as well as required character types such as uppercase letters, lowercase 
 * letters, numbers, and special characters. Users can also add custom rules.
 * 
 * ## Usage
 * 
 * Here's how to use the PasswordValidator:
 * 
 * ```typescript
 * import PasswordValidator from 'password-validator-pro';
 * 
 * const validator = new PasswordValidator({
 *   minLength: 8,
 *   maxLength: 20,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true,
 * });
 * 
 * const result = validator.validate('Password123!');
 * console.log(result); // { valid: true, errors: [] }
 * ```
 * 
 * You can also add custom validation rules:
 * 
 * ```typescript
 * const noSpacesRule = {
 *   code: 'NO_SPACES',
 *   message: 'Password must not contain spaces.',
 *   validate: (password: string) => !/\s/.test(password),
 * };
 * 
 * validator.addCustomRule(noSpacesRule);
 * 
 * const customResult = validator.validate('Password With Space123!');
 * console.log(customResult); // { valid: false, errors: ['NO_SPACES'] }
 * ```
 */

export { default as PasswordValidator } from './validator'; // Adjust if needed based on your file structure
