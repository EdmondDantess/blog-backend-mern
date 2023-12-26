import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи')
        .isLength({ min: 3 }),
    body('text', 'Введите текст статьи')
        .isLength({ min: 10 }),
    body('tags', 'Неверный формат тегов')
        .optional()
        .isString(),
    body('imageUrl', 'Неверная ссылка на изображение')
        .optional()
        .isString()
];
