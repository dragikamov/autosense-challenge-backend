import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as config from './config';

// Helmet helps you secure your Express apps by setting various HTTP headers.
import helmet from 'helmet';

// CORS is a node.js package for providing a Connect/Express 
// middleware that can be used to enable 
// CORS (Cross-origin resource sharing) with various options.
import * as cors from 'cors';
import * as middlewares from './middlewares';

import pumps from './routes/pumps';
import stations from './routes/stations';

const api = express();

api.use(cors());
api.use(bodyParser.json());

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);

// Basic route
api.get('/', (req: express.Request, res: express.Response) => {
    const token = jwt.sign({ id: '1234567890' }, config.JWT_KEY, { expiresIn: '7d' });

    return res.status(200).json({
        name: 'autoSense Challenge API',
        jwt: token,
    });
});

api.use('/pumps', pumps);
api.use('/stations', stations);

api.get('*', (req: express.Request, res: express.Response) => {
    return res.status(404).json({
        error: 'Not Found',
        message: 'The requested URL was not found on this server: ' + req.url,
    });
});

export default api;
