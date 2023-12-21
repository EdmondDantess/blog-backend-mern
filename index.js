import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose
    .connect('mongodb+srv://maximlavrovsky:maximsmongodb@cluster0.aufmgcu.mongodb.net/blog-mern?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK...'))
    .catch((e) => console.log('DB error', e));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Start develop');
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            res.status(404)
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
});
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            res.status(404)
                .json({
                    message: 'Пользователь не найден'
                });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            res.status(400)
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
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json(errors);
        }

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
        } = user._doc;

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
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is OK...');
});
