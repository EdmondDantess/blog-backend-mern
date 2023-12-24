import PostModel from '../models/Post';
import {Request, Response} from 'express';

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find()
            .populate('user') // Связали наше поле user для того чтобы достать из таблицы User св-ва и поместить в текущее св-во
            .exec();
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось получить посты'
            });
    }
};
export const getPost = async (req: Request, res: Response) => {
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
export const deletePost = async (req: Request, res: Response) => {
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

export const postCreate = async (req: Request, res: Response) => {
    try {

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

export const updatePost = async (req: Request, res: Response) => {
    try {

        const postId = req.params.id;

        await PostModel.updateOne({_id: postId},
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
