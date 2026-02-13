export const NO_SPECIAL_CHARS_REG = /^[a-zA-Z0-9-_]*$/
export const EMAIL_REG = /^[^\s@]+@[^\s@]+\.com$/
export const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
export const PHONE_REG = /^(0[3-9][0-9]{8}|\+84[3-9][0-9]{8})$/
export const NAME_REG = /^\p{L}+([\s-]\p{L}+)*$/u

