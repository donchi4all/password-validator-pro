interface ErrorInterface {
    status: number;
    code: string;
    message: string;
}

type ErrorMessages = {
    PASSWORD_TOO_SHORT: (minLength: number) => string;
    PASSWORD_TOO_LONG: (maxLength: number) => string;
    NO_UPPERCASE: string;
    NO_LOWERCASE: string;
    NO_NUMBERS: string;
    NO_SPECIAL_CHARS: string;
};

class PasswordValidator {
    private minLength: number;
    private maxLength: number;
    private requireUppercase: boolean;
    private requireLowercase: boolean;
    private requireNumbers: boolean;
    private requireSpecialChars: boolean;
    private customRules: { [key: string]: (password: string) => boolean } = {};
    private errorMessages: ErrorMessages;

    constructor(options: {
        minLength?: number;
        maxLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    }) {
        this.minLength = options.minLength || 8;
        this.maxLength = options.maxLength || 20;
        this.requireUppercase = options.requireUppercase !== false; // default to true
        this.requireLowercase = options.requireLowercase !== false; // default to true
        this.requireNumbers = options.requireNumbers !== false; // default to true
        this.requireSpecialChars = options.requireSpecialChars !== false; // default to true
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
        this.customRules[rule.code] = rule.validate;
    }

    validate(password: string) {
        const errors: string[] = [];
        let valid = true;

        if (password.length < this.minLength) {
            errors.push(this.errorMessages.PASSWORD_TOO_SHORT(this.minLength));
            valid = false;
        }

        if (password.length > this.maxLength) {
            errors.push(this.errorMessages.PASSWORD_TOO_LONG(this.maxLength));
            valid = false;
        }

        if (this.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push(this.errorMessages.NO_UPPERCASE);
            valid = false;
        }

        if (this.requireLowercase && !/[a-z]/.test(password)) {
            errors.push(this.errorMessages.NO_LOWERCASE);
            valid = false;
        }

        if (this.requireNumbers && !/[0-9]/.test(password)) {
            errors.push(this.errorMessages.NO_NUMBERS);
            valid = false;
        }

        if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push(this.errorMessages.NO_SPECIAL_CHARS);
            valid = false;
        }

        // Check custom rules
        for (const code in this.customRules) {
            if (!this.customRules[code](password)) {
                errors.push(code); // Using the code as the error message for simplicity
                valid = false;
            }
        }

        return { valid, errors };
    }
}

export default PasswordValidator;
