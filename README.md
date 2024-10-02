# password-validator-pro

A customizable password validator for Node.js and browser applications. This package allows you to define your own password validation rules, ensuring that passwords meet your security requirements.

## Features

- Set minimum and maximum password length.
- Require uppercase letters, lowercase letters, numbers, and special characters.
- Add custom validation rules for your specific needs.
- Comprehensive error messages for validation failures.

## Installation

You can install the package via npm:

```bash
npm install password-validator-pro
```

## Usage

### Basic Usage

Here's how to use the `PasswordValidator` class:

Javascript Usage

```javascript
const { PasswordValidator } = require('password-validator-pro');
```

TypeScript Usage

```typescript
import { PasswordValidator, ErrorInterface  } from 'password-validator-pro';

// Create an instance of the PasswordValidator with your desired options
const validator = new PasswordValidator({
  minLength: 8,                // Minimum length of the password
  maxLength: 20,               // Maximum length of the password
  requireUppercase: true,      // Require at least one uppercase letter
  requireLowercase: true,      // Require at least one lowercase letter
  requireNumbers: true,        // Require at least one number
  requireSpecialChars: true,   // Require at least one special character
  combineErrors: true,  // Set this to true to combine all errors into one message

});

// Validate a password
const result = validator.validate('Password123!');

if (result.valid) {
  console.log('Password is valid!');
} else {
  console.log('Password is invalid:', result.errors);
}
```


## Validator Options

The `PasswordValidator` class accepts the following options:

| Option             | Type    | Default | Description                                                                                       |
|--------------------|---------|---------|---------------------------------------------------------------------------------------------------|
| `minLength`        | Number  | 8       | Minimum length of the password                                                                    |
| `maxLength`        | Number  | 20      | Maximum length of the password                                                                    |
| `requireUppercase` | Boolean | true    | Whether to require at least one uppercase letter                                                  |
| `requireLowercase` | Boolean | true    | Whether to require at least one lowercase letter                                                  |
| `requireNumbers`   | Boolean | true    | Whether to require at least one number                                                            |
| `requireSpecialChars` | Boolean | true | Whether to require at least one special character                                                 |
| `combineErrors`    | Boolean | false   | When true, combines all validation errors into a single error object with concatenated messages    |



### Adding Custom Rules

You can also define and add custom validation rules. For example, to disallow spaces in the password:

```typescript
// Define a custom rule for disallowing spaces
const noSpacesRule = {
  code: 'NO_SPACES',
  message: 'Password must not contain spaces.',
  validate: (password: string) => !/\s/.test(password), // Validation logic
};

// Add the custom rule to the validator
validator.addCustomRule(noSpacesRule);

// Validate a password with spaces
const customResult = validator.validate('Password With Space123!');

if (customResult.valid) {
  console.log('Password is valid!');
} else {
  console.log('Password is invalid:', customResult.errors);
   /*
   Error message from  customResult.errors
   [
      {
        status: 400,
        code: 'PASSWORD_BREACHED',
        message: 'This password has been compromised in a data breach.'
      }
  */
    ]
}
```

### Adding Custom Rules for Breach Detection Rule
The Breach Detection feature allows you to enhance password validation by checking whether a password has been compromised in a known data breach. This feature can leverage third-party APIs, such as HaveIBeenPwned, or a custom list of breached passwords.

```typescript

// Define a custom rule for disallowing spaces

// Mock external breach detection function
function checkPasswordBreach(password: string): boolean {
    // This is a mock implementation. Replace with real API calls like HaveIBeenPwned or leave it as custom as this.
    const breachedPasswords = ['Password123!', '123456789'];
    return breachedPasswords.includes(password);
}

// Add a custom rule for breach detection
const breachDetectionRule = {
  code: 'PASSWORD_BREACHED',
  message: 'This password has been compromised in a data breach.',
  validate: (password: string) => {
    return !(checkPasswordBreach(password));
  },
};

// Add the breach detection rule
validator.addCustomRule(breachDetectionRule);

// Validate a password
const passwordToTest = 'Password123!';

const result = validator.validate(passwordToTest);

if (result.valid) {
  console.log('Password is valid!');
} else {
  console.log('Password is invalid:', result.errors);

  // You can format the errors and throw an exceptions as one

  // Combine error codes with '|' and messages with ', '
    const combinedErrorCodes = result.errors.map(err => err.code).join('|');
    // Combine messages and remove "." before each ","
    const combinedErrorMessages = passwordInvalidErrors
        .map(err => err.message)
        .join(', ')
        .replace(/\.\s*,/g, ', '); // Replace ".," with ","


    // Create a single error object to pass to AuthErrorHandler
    const errorToThrow: ErrorInterface = {
        code: combinedErrorCodes, // Pass the combined error codes
        message: combinedErrorMessages, // Pass the combined error messages
        status: 400,
    };

    throw new errorToThrow;
}



## Combining Errors

The `combineErrors` option allows you to specify whether validation errors should be combined into a single message or returned individually.

- **When `combineErrors` is `true`** (default):
  
  All errors will be concatenated into a single message, with error codes joined by ` | ` and error messages separated by `, `.

  ```typescript
  const passwordValidator = new PasswordValidator({
      combineErrors: true,
  });

  const { valid, errors } = passwordValidator.validate('short');

  // Example of combined errors:
  // errors = [{
  //   status: 400,
  //   code: 'PASSWORD_TOO_SHORT | NO_UPPERCASE | NO_NUMBERS',
  //   message: 'Password must be at least 8 characters long, Password must contain at least one uppercase letter, Password must contain at least one number.'
  // }]
  ```

- **When `combineErrors` is `false`**:

  Each error will be returned individually as separate objects in the `errors` array.

  ```typescript
  const passwordValidator = new PasswordValidator({
      combineErrors: false,
  });

  const { valid, errors } = passwordValidator.validate('short');

  // Example of individual errors:
  // errors = [
  //   { status: 400, code: 'PASSWORD_TOO_SHORT', message: 'Password must be at least 8 characters long.' },
  //   { status: 400, code: 'NO_UPPERCASE', message: 'Password must contain at least one uppercase letter.' },
  //   { status: 400, code: 'NO_NUMBERS', message: 'Password must contain at least one number.' }
  // ]
  ```


## Error Messages

The validator returns an object with a `valid` property indicating whether the password is valid and an `errors` array containing the error messages. Here are the default error messages you may encounter:

- `PASSWORD_TOO_SHORT`: Password must be at least X characters long.
- `PASSWORD_TOO_LONG`: Password must be at most X characters long.
- `NO_UPPERCASE`: Password must contain at least one uppercase letter.
- `NO_LOWERCASE`: Password must contain at least one lowercase letter.
- `NO_NUMBERS`: Password must contain at least one number.
- `NO_SPECIAL_CHARS`: Password must contain at least one special character.

## Customization

You can customize the validation logic by modifying the options you pass to the `PasswordValidator` constructor or by adding custom rules. This makes the package flexible to fit your specific security requirements.

## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for inspiring this package.
