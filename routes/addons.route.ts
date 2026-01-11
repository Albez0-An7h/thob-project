import { Request, Response, Router } from 'express';
import { getAllAddons } from '../modules/catalog/addons.data';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
    logger.info('Fetching addons catalog');

    const addons = getAllAddons();

    res.status(200).json({
        success: true,
        data: addons,
    });
});

export default router;
