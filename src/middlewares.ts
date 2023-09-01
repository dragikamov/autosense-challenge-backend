import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as config from './config';

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");

    // Intercept OPTIONS method
    if ("OPTIONS" === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
    // Check header or url parameters or post parameters for token
    const token = req.headers.authorization as string;

    if (!token) {
        return res.status(401).send({
            error: "Unauthorized",
            message: "No token provided in the request",
        });
    }

    // Verifies secret and checks exp
    jwt.verify(token, config.JWT_KEY, (err: jwt.VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
            return res.status(401).send({
                error: "Unauthorized",
                message: "Failed to authenticate token.",
            });
        } else if (decoded) {
            // If everything is good, save to request for use in other routes
            req.userId = (decoded as { id: string }).id;
            next();
        }
    });
};

export { allowCrossDomain, checkAuthentication };
