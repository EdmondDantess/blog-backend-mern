import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';

export const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });
        const user = await doc.save();
        const token = jwt.sign(
            {
                _id: user._id
            }, 'secret123', {
                expiresIn: '30d'
            }
        );

        let {
            passwordHash,
            ...userData
        } = user;

        res.json({
            ...userData,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось зарегистрироваться'
            });
    }
};

export const login = async (req: Request, res: Response) => {
    try {

        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404)
                .json({
                    message: 'Пользователь не найден'
                });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400)
                .json({
                    message: 'Неверный логин или пароль'
                });
        }
        const token = jwt.sign(
            {
                _id: user._doc._id
            }, 'secret123', {
                expiresIn: '30d'
            }
        );
        let {
            passwordHash,
            ...userData
        } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500)
            .json({
                message: 'Не удалось авторизоваться'
            });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404)
                .json({
                    message: 'Пользователь не найден'
                });
        }

        let {
            passwordHash,
            ...userData
        } = user._doc;

        res.json({
            ...userData
        });
    } catch (e) {
        res.status(400)
            .json({
                message: 'Нет доступа'
            });
        console.log(e);
    }
};
