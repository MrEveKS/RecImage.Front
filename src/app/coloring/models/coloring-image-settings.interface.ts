import { IConvertOptions } from './convert-options.interface';
import { IColoringObjectSettings } from './coloring-object-settings.interface';

/**
 * Settings of image converting
 */
export interface IColoringImageSettings
  extends IColoringObjectSettings,
    IConvertOptions {
  imageId?: number;
}
