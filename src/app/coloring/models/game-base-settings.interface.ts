import { ColorStep } from "./color-step.enum";

/**
 * Settins of image converting
 */
export interface IGameBaseSettings {
    size: number; // picture size
    colorStep: ColorStep;
    colored: boolean;
    colorSave: boolean;
}
