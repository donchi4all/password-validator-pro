import PasswordValidator from '../src/validator'; // Adjust the path accordingly

describe('PasswordValidator', () => {
    let validator: PasswordValidator;

    beforeEach(() => {
        validator = new PasswordValidator({
            minLength: 8,
            maxLength: 20,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            combineErrors: true,
        });
    });

    it('should validate a correct password', () => {
        const result = validator.validate('ValidPass123!');
        expect(result.valid).toBe(true);
    });

    it('should invalidate a password with spaces', () => {
        const noSpacesRule = {
            code: 'NO_SPACES',
            message: 'Password must not contain spaces.',
            validate: (password: string) => !/\s/.test(password),
        };

        validator.addCustomRule(noSpacesRule);
        const result = validator.validate('Password With Space123!');
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual({
            status: 400,
            code: 'PASSWORD_TOO_LONG | NO_SPACES',
            message: 'Password must be at most 20 characters long, Password must not contain spaces.'
        });
    });

    it('should invalidate a password that is too short', () => {
        const result = validator.validate('Short1!'); // A password shorter than 8 characters
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual({
            status: 400,
            code: 'PASSWORD_TOO_SHORT',
            message: 'Password must be at least 8 characters long.',
        });
    });

    it('should invalidate a password that is too long', () => {
        const result = validator.validate('ThisPasswordIsWayTooLong123!'); // A password longer than 20 characters
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual({
            status: 400,
            code: 'PASSWORD_TOO_LONG',
            message: 'Password must be at most 20 characters long.',
        });
    });
});
