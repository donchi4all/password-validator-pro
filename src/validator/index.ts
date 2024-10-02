import { ErrorInterface, ErrorMessages, ValidatorOptions } from "../types";

class PasswordValidator {
    private minLength: number;
    private maxLength: number;
    private requireUppercase: boolean;
    private requireLowercase: boolean;
    private requireNumbers: boolean;
    private requireSpecialChars: boolean;
    private combineErrors: boolean;
    private customRules: { [key: string]: { validate: (password: string) => boolean; message: string } } = {};
    private errorMessages: ErrorMessages;

    constructor(options: ValidatorOptions) {
        this.minLength = options.minLength || 8;
        this.maxLength = options.maxLength || 20;
        this.requireUppercase = options.requireUppercase !== false; // default to true
        this.requireLowercase = options.requireLowercase !== false; // default to true
        this.requireNumbers = options.requireNumbers !== false; // default to true
        this.requireSpecialChars = options.requireSpecialChars !== false; // default to true
        this.combineErrors = options.combineErrors !== false; // default to true (combine errors)
        this.errorMessages = {
            PASSWORD_TOO_SHORT: (minLength) => `Password must be at least ${minLength} characters long.`,
            PASSWORD_TOO_LONG: (maxLength) => `Password must be at most ${maxLength} characters long.`,
            NO_UPPERCASE: 'Password must contain at least one uppercase letter.',
            NO_LOWERCASE: 'Password must contain at least one lowercase letter.',
            NO_NUMBERS: 'Password must contain at least one number.',
            NO_SPECIAL_CHARS: 'Password must contain at least one special character.',
        };
    }

    addCustomRule(rule: { code: string; message: string; validate: (password: string) => boolean }) {
        this.customRules[rule.code] = {
            validate: rule.validate,
            message: rule.message,
        };
    }

    validate(password: string): { valid: boolean; errors: ErrorInterface[] } {
        let errors: ErrorInterface[] = []; // Changed to 'let' to allow reassignment
        const status = 400; // HTTP status code for bad requests
        const errorCodes: string[] = []; // To collect error codes
        const errorMessages: string[] = []; // To collect error messages

        // Check built-in rules
        if (password.length < this.minLength) {
            errorCodes.push('PASSWORD_TOO_SHORT');
            errorMessages.push(this.errorMessages.PASSWORD_TOO_SHORT(this.minLength));
        }

        if (password.length > this.maxLength) {
            errorCodes.push('PASSWORD_TOO_LONG');
            errorMessages.push(this.errorMessages.PASSWORD_TOO_LONG(this.maxLength));
        }

        if (this.requireUppercase && !/[A-Z]/.test(password)) {
            errorCodes.push('NO_UPPERCASE');
            errorMessages.push(this.errorMessages.NO_UPPERCASE);
        }

        if (this.requireLowercase && !/[a-z]/.test(password)) {
            errorCodes.push('NO_LOWERCASE');
            errorMessages.push(this.errorMessages.NO_LOWERCASE);
        }

        if (this.requireNumbers && !/[0-9]/.test(password)) {
            errorCodes.push('NO_NUMBERS');
            errorMessages.push(this.errorMessages.NO_NUMBERS);
        }

        if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errorCodes.push('NO_SPECIAL_CHARS');
            errorMessages.push(this.errorMessages.NO_SPECIAL_CHARS);
        }

        // Check custom rules
        for (const code in this.customRules) {
            const rule = this.customRules[code];
            if (!rule.validate(password)) {
                errorCodes.push(code);
                errorMessages.push(rule.message); // Use the custom rule message
            }
        }

        // Prepare final error object if there are errors
        if (errorCodes.length > 0) {
            if (this.combineErrors) {
                const concatenatedCodes = errorCodes.join(' | ');
                const concatenatedMessages = errorMessages.join(', ').replace(/\.,/g, ','); // Remove "." before commas
                errors.push({
                    status,
                    code: concatenatedCodes,
                    message: concatenatedMessages,
                });
            } else {
                // Show each error individually
                errors = errorCodes.map((code, index) => ({
                    status,
                    code,
                    message: errorMessages[index],
                }));
            }
        }

        return { valid: errors.length === 0, errors };
    }
}

export default PasswordValidator;
