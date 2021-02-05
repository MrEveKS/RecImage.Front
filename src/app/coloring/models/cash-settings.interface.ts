import { IGameSettings } from "./game-settings.interface";

/**
 * Settins of image converting
 */
export interface ICashSettings extends IGameSettings {
    fileName?: string;
}
