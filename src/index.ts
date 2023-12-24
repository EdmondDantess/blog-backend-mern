import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'
import {loginValidation, registerValidation} from './validations/auth';
import {PostController, UserController} from './controllers';
import {postCreateValidation} from './validations/post';
import {checkAuth, handleValidationErrors} from './utils';

mongoose
    .connect('mongodb+srv://maximlavrovsky:maximsmongodb@cluster0.aufmgcu.mongodb.net/blog-mern?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK...'))
    .catch((e) => {
        console.log('DB error', e);
    });

const app = express();
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.get('/', (req: Request, res: Response) => {
    res.send('Start develop');
});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file?.originalname}`
    });
});

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', ...loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', ...registerValidation, handleValidationErrors, UserController.register);

app.patch('/posts/:id', checkAuth, ...postCreateValidation, handleValidationErrors, PostController.updatePost);
app.get('/posts/:id', PostController.getPost);
app.delete('/posts/:id', checkAuth, PostController.deletePost);
app.get('/posts', PostController.getAllPosts);
app.post('/posts', checkAuth, ...postCreateValidation, handleValidationErrors, PostController.postCreate);

app.get('/tags', PostController.getLastTags)

app.listen(4444, () => {
    console.log('Server is OK...');
});
