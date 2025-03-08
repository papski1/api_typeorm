import 'reflect-metadata';
import 'rootpath';
import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initialize } from './_helpers/db';

const { errorHandler } = require('./_middleware/error-handler');
const usersController = require('./users/users.controller');

dotenv.config();

if (!process.env.NODE_ENV) {
    console.log(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10);

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/users', usersController);

app.use(errorHandler);

initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        });
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });
