import { Request, Response, Router } from 'express';
import { getAllSizes } from '../modules/catalog/sizes.data';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
    logger.info('Fetching sizes catalog');

    const sizes = getAllSizes();

    res.status(200).json({
        success: true,
        data: sizes,
    });
});

export default router;
