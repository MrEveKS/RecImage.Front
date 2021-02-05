import { IRecColor } from "./rec-color.interface";

export interface IRecUpdate {
    recColor: IRecColor;
    clear: boolean;
    colorSave: boolean;
}