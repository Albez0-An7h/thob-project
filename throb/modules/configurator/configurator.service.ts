import { Configuration, safeParseConfiguration } from './configurator.schema';
import { calculatePrice } from '../pricing/pricing.engine';
import { ConfigurationResponse } from '../../types';
import { ValidationError, formatZodError } from '../../utils/error';
import { logger } from '../../utils/logger';

export function processConfiguration(input: unknown): ConfigurationResponse {
    const validationResult = safeParseConfiguration(input);

    if (!validationResult.success) {
        const errorMessage = formatZodError(validationResult.error);
        logger.warn('Validation failed', { errors: validationResult.error.errors });
        throw new ValidationError(errorMessage, validationResult.error.errors);
    }

    const config: Configuration = validationResult.data;
    logger.info('Config validated', { config });

    
    const pricing = calculatePrice({
        material: config.material,
        size: config.size,
        addons: config.addons,
    });

    logger.info('Pricing calculated', { pricing });

    
    return {
        success: true,
        configuration: {
            material: config.material,
            color: config.color,
            size: config.size,
            addons: config.addons,
        },
        pricing,
    };
}

export function validateConfiguration(input: unknown): { valid: boolean; errors?: string } {
    const validationResult = safeParseConfiguration(input);

    if (!validationResult.success) {
        return {
            valid: false,
            errors: formatZodError(validationResult.error),
        };
    }

    return { valid: true };
}
