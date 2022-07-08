import { IColoringImageSettings } from './coloring-image-settings.interface';

/**
 * Settings of image converting
 */
export interface ICashSettings extends IColoringImageSettings {
  fileName?: string;
}
