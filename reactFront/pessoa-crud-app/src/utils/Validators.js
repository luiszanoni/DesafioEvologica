// utils/validators.js
export const validateCPF = (cpf) => {
    // Remove non-digits
    cpf = cpf.replace(/\D/g, '');

    // Check if it has 11 digits
    if (cpf.length !== 11) {
        return false;
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validate verification digits
    let sum = 0;
    let remainder;

    // First verification digit
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Second verification digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

export const validateEmail = (email) => {
    const re = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    return re.test(email);
};