import { EventEmitter, Injectable } from '@angular/core';
// interfaces
import { IColoringSettings } from '../models/coloring-settings.interface';
import { IRecUpdate } from '../models/rec-update.interface';
// contants
import { COLOR_STEPS } from '../models/constants/color-steps.constant';
import { DEFAULT_ZOOM, DEFAULT_COLOR_STEPS_INDEX, DEFAULT_SIZES_INDEX } from '../models/constants/coloring-settings.constants';
import { CORING_SIZES } from '../models/constants/coloring-sizes.constant';

@Injectable({
    providedIn: 'root'
})
export class ColoringHelperService {

    public coloringSettings!: IColoringSettings;

    public onZoomChange = new EventEmitter();
    public onSettingsChange = new EventEmitter();
    public onFilesSelect = new EventEmitter();
    public onFilesSelectFromNavigate = new EventEmitter();
    public onUpdateCanvas = new EventEmitter<IRecUpdate>();

    constructor() {
        this._initDefaultSettings();
    }

    private _initDefaultSettings(): void {
        this.coloringSettings = {
            zoom: DEFAULT_ZOOM,
            colorSteps: COLOR_STEPS,
            imageFiles: null,
            sizes: CORING_SIZES,
            colorStepsIndex: DEFAULT_COLOR_STEPS_INDEX,
            sizesIndex: DEFAULT_SIZES_INDEX,
            progress: 0,
            settings: {
                colorStep: COLOR_STEPS[DEFAULT_COLOR_STEPS_INDEX].value,
                size: CORING_SIZES[DEFAULT_SIZES_INDEX].value,
                colorSave: true,
                colored: true,
            }
        };
    }

}