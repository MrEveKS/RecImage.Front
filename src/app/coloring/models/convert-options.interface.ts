import { ColorStep } from './color-step.enum';

export interface IConvertOptions {
  imageId?: number;
  colored: boolean;
  size: number;
  colorStep: ColorStep;
}
