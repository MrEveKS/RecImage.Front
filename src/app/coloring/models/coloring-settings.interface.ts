import { ISelectValue } from "src/app/models/select-value.interface";
import { ICashSettings } from "./cash-settings.interface";

/**
 * Coloring Settins
 */
export interface IColoringSettings {
    loading: boolean;
    zoom: number;
    imageFiles: FileList;
    settings: ICashSettings;
    colorSteps: ISelectValue<number>[];
    sizes: ISelectValue<number>[];
    colorStepsIndex: number;
    sizesIndex: number;
    progress: number;
}
