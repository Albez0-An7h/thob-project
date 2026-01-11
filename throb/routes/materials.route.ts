
import { Request, Response, Router } from 'express';
import { getAllMaterials } from '../modules/catalog/materials.data';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
    logger.info('Fetching materials catalog');

    const materials = getAllMaterials();

    res.status(200).json({
        success: true,
        data: materials,
    });
});

export default router;
