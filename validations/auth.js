import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты')
        .isEmail(),
    body('password', 'Минимум 8 символов')
        .isLength({ min: 8 }),
    body('fullName', 'Минимум 3 символа')
        .isLength({ min: 3 }),
    body('avatar', 'Некорректная ссылка')
        .optional()
        .isURL()
];
export const loginValidation = [
    body('email', 'Неверный формат почты')
        .isEmail(),
    body('password', 'Минимум 8 символов')
        .isLength({ min: 8 })
];
