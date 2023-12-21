import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
    .connect('mongodb+srv://maximlavrovsky:maximsmongodb@cluster0.aufmgcu.mongodb.net/?retryWrites=true&w=majority')
    .then((r) => console.log('DB is OK...'))
    .catch((e) => console.log('DB error', e));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Start develop');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: 'ФИО'
        }, 'секретный ключ'
    );

    res.json({
        info: 'TEST !',
        token
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is OK...');
});
