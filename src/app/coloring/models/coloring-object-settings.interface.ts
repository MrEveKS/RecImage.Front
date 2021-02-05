import { ColorStep } from "./color-step.enum";

/**
 * Settins of image converting
 */
export interface IColoringObjectSettings {
    size: number; // picture size
    colorStep: ColorStep;
    colored: boolean;
    colorSave: boolean;
}
