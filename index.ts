import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { AppError } from './utils/error';

import configureRoute from './routes/configure.route';
import materialsRoute from './routes/materials.route';
import sizesRoute from './routes/sizes.route';
import addonsRoute from './routes/addons.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req: Request, _res: Response, next: NextFunction): void => {
    logger.info(`${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
    });
    next();
});

app.get('/health', (_req: Request, res: Response): void => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/configure', configureRoute);
app.use('/materials', materialsRoute);
app.use('/sizes', sizesRoute);
app.use('/addons', addonsRoute);

// 404
app.use((req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
});

//
app.use((err: Error, req: Request, res: Response, _next: NextFunction): void => {
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
    });

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                details: err.details,
            },
        });
        return;
    }

    
    res.status(500).json({
        success: false,
        error: {
            message: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
    });
});

app.listen(PORT, (): void => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`http://localhost:${PORT}`);
});

export default app;
