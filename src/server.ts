import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import cors from 'cors';

import { router } from './routes'


const app = express();
const path = require('path');
const PORT = process.env.PORT || 3333
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    return res.json("hello word");
});

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message
        })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    })
})

app.use(express.static("public"))

app.use(express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => console.log('Servidor online!!!!'));