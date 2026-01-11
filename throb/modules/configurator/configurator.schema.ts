import { z } from 'zod';
import { isColorAllowedForMaterial, getMaterial } from '../catalog/materials.data';
import { getSize } from '../catalog/sizes.data';
import { areAddonsValid } from '../catalog/addons.data';

export const MaterialSchema = z.enum(['leather', 'fabric'], {
    errorMap: () => ({ message: 'Material must be either "leather" or "fabric"' }),
});

export const SizeSchema = z.enum(['two_seater', 'three_seater', 'l_shape'], {
    errorMap: () => ({ message: 'Size must be one of: two_seater, three_seater, l_shape' }),
});

export const ColorSchema = z.string().min(1, 'Color is required');

export const AddonsSchema = z
    .array(z.enum(['recliner', 'storage', 'headrest']))
    .optional()
    .default([]);

export const ConfigurationSchema = z
    .object({
        material: MaterialSchema,
        color: ColorSchema,
        size: SizeSchema,
        addons: AddonsSchema,
    })
    .strict()
    .refine(
        (data) => isColorAllowedForMaterial(data.material, data.color),
        (data) => ({
            message: `Color "${data.color}" is not available for material "${data.material}"`,
            path: ['color'],
        })
    )
    .refine(
        (data) => {

            const material = getMaterial(data.material);
            const size = getSize(data.size);
            if (!material || !size) return false;
            return size.widthCm <= material.maxWidthCm;
        },
        (data) => ({
            message: `Size "${data.size}" is not compatible with material "${data.material}" (width constraint exceeded)`,
            path: ['size'],
        })
    )
    .refine(
        (data) => areAddonsValid(data.addons),
        { message: 'One or more add-ons are invalid', path: ['addons'] }
    );


export type Material = z.infer<typeof MaterialSchema>;
export type Size = z.infer<typeof SizeSchema>;
export type Addon = z.infer<typeof AddonsSchema>[number];
export type Configuration = z.infer<typeof ConfigurationSchema>;

export function parseConfiguration(input: unknown): Configuration {
    return ConfigurationSchema.parse(input);
}

export function safeParseConfiguration(input: unknown): z.SafeParseReturnType<unknown, Configuration> {
    return ConfigurationSchema.safeParse(input);
}
