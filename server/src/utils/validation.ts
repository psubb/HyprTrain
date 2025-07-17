import validator from 'validator';

export function validateRegisterInput(email: string, password: string): boolean {
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1
        })
    ) {
        return false;
    }

    if (!validator.isEmail(email)) {
        return false;
    }

    return true;
}