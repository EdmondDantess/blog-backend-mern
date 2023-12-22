import express from 'express';
import mongoose from 'mongoose';
import { loginValidation, registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register } from './controllers/UserController.js';
import {
    deletePost,
    getAllPosts,
    getPost,
    postCreate,
    updatePost
} from './controllers/PostController.js';
import { postCreateValidation } from './validations/post.js';

mongoose
    .connect('mongodb+srv://maximlavrovsky:maximsmongodb@cluster0.aufmgcu.mongodb.net/blog-mern?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK...'))
    .catch((e) => console.log('DB error', e));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Start develop');
});

app.get('/auth/me', checkAuth, getMe);
app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);

app.patch('/posts/:id', checkAuth, postCreateValidation, updatePost);
app.get('/posts/:id', getPost);
app.delete('/posts/:id', checkAuth, deletePost);
app.get('/posts', getAllPosts);
app.post('/posts', checkAuth, postCreateValidation, postCreate);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is OK...');
});
