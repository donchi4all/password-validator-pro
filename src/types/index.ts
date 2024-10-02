
export interface ErrorInterface {
    status: number; // HTTP status code
    code: string; // Error code
    message: string; // Error message
}

export type ErrorMessages = {
    PASSWORD_TOO_SHORT: (minLength: number) => string;
    PASSWORD_TOO_LONG: (maxLength: number) => string;
    NO_UPPERCASE: string;
    NO_LOWERCASE: string;
    NO_NUMBERS: string;
    NO_SPECIAL_CHARS: string;
};

export interface ValidatorOptions {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    combineErrors?: boolean;
}
