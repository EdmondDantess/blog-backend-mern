import PostModel from '../models/Post.js';
import { validationResult } from 'express-validator';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user') // Связали наше поле user для того чтобы достать из таблицы User св-ва и поместить в текущее св-во
            .exec();
        const {
            passwordHash,
            ...postsFormatted
        } = posts;
        res.json(postsFormatted);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось получить посты'
            });
    }
};
export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const data = await PostModel.findByIdAndUpdate(postId,
            {
                $inc: {
                    viewCount: 1
                }
            }, {
                returnDocument: 'after'  // вернёт документ после того как выполнит инкрементирование
            });
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось получить пост'
            });
    }
};
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.findByIdAndDelete(postId);
        res.json({
            success: true
        });
    } catch (e) {
        console.log(e);
        return res.status(500)
            .json({
                message: 'Не удалось удалить пост'
            });
    }

};

export const postCreate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json(errors);
        }
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.title,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });
        const post = await doc.save();
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось создать статью'
            });
    }
};

export const updatePost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json(errors);
        }
        const postId = req.params.id;
        await PostModel.updateOne({ _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags
            }
        );
        res.json({
            success: true
        });
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось обновить статью'
            });
    }
};
