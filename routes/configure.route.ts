import { Request, Response, NextFunction, Router } from 'express';
import { processConfiguration } from '../modules/configurator/configurator.service';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
        logger.info('Received configuration request', { body: req.body });

        const result = processConfiguration(req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
