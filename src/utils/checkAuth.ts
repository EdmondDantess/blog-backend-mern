import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

interface JwtPayload {
    _id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const {_id} = jwt.verify(token, 'secret123') as JwtPayload
            req.userId = _id
            next();
        } catch (e) {
            console.log(e);
            res.status(403)
                .json({
                    message: 'Нет доступа'
                });
        }
    } else {
        return res.status(400)
            .json({
                message: 'Нет доступа'
            });
    }

}
