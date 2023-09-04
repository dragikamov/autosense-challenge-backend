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
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

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

api.use('/stations', stations);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AutoSense Challenge API",
            version: "0.1.0",
            description:
                "This is a CRUD API application made for an autoSense take home exercise. It is made with Node.JS, Express.JS and TypeScript and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Dragi Kamov",
                email: "dragikamov@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:4000/stations",
            },
        ],
    },
    apis: ["./built/src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
api.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCssUrl:
            "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
    })
);

api.get('*', (req: express.Request, res: express.Response) => {
    return res.status(404).json({
        error: 'Not Found',
        message: 'The requested URL was not found on this server: ' + req.url,
    });
});

export default api;
