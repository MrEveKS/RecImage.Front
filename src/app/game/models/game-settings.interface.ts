import { IConvertOptions } from "./convert-options.interface";
import { IGameBaseSettings } from "./game-base-settings.interface";

/**
 * Settins of image converting
 */
export interface IGameSettings extends IGameBaseSettings, IConvertOptions {
    imageId?: number;
}
