import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// interfaces
import { IColoringSettings } from "../models/coloring-settings.interface";
import { ColoringHelperService } from "../services/coloring-helper.service";

const { clearTimeout, setTimeout } = window;
@Component({
    selector: 'coloring-menu',
    styleUrls: ['./coloring-menu.component.scss'],
    templateUrl: './coloring-menu.component.html',
})
export class ColoringMenuComponent implements OnInit {

    public coloringSettings!: IColoringSettings;

    @ViewChild('fileInput', { read: ElementRef })
    private _fileInput: ElementRef<HTMLInputElement>;
    @ViewChild('saveInfo', { read: ElementRef })
    private _saveInfo: ElementRef<HTMLDivElement>;
    @ViewChild('coloredInfo', { read: ElementRef })
    private _coloredInfo: ElementRef<HTMLDivElement>;
    @ViewChild('qualityInfo', { read: ElementRef })
    private _qualityInfo: ElementRef<HTMLDivElement>;
    @ViewChild('sizeInfo', { read: ElementRef })
    private _sizeInfo: ElementRef<HTMLDivElement>;

    private _timeId: number;

    public constructor(private _coloringHelper: ColoringHelperService) {
    }

    public ngOnInit(): void {
        this.coloringSettings = this._coloringHelper.coloringSettings;
    }

    public resize(zoom: number): void {
        this.coloringSettings.zoom = zoom;
        this._coloringHelper.onZoomChange.emit();
    }

    public filesSelect(files: FileList): void {
        this.coloringSettings.imageFiles = files;
        this._coloringHelper.onFilesSelect.emit();
    }

    public handleColorSave(): void {
        this.coloringSettings.settings.colorSave
            = !this.coloringSettings.settings.colorSave;
        this._hideElements('saveInfo');
        this._showElement(this._saveInfo.nativeElement);
        this._settingsChange();
    }

    public handleColored(): void {
        this.coloringSettings.settings.colored
            = !this.coloringSettings.settings.colored;
        this._hideElements('coloredInfo');
        this._showElement(this._coloredInfo.nativeElement);
        this._settingsChange();
    }

    public handleQuality(): void {
        this.coloringSettings.colorStepsIndex++;
        if (this.coloringSettings.colorStepsIndex >= this.coloringSettings.colorSteps.length) {
            this.coloringSettings.colorStepsIndex = 0;
        }
        this.coloringSettings.settings.colorStep
            = this.coloringSettings.colorSteps[this.coloringSettings.colorStepsIndex].value;
        this._hideElements('qualityInfo');
        this._showElement(this._qualityInfo.nativeElement);
        this._settingsChange();
    }

    public handleSize(): void {
        this.coloringSettings.sizesIndex++;
        if (this.coloringSettings.sizesIndex >= this.coloringSettings.sizes.length) {
            this.coloringSettings.sizesIndex = 0;
        }
        this.coloringSettings.settings.size
            = this.coloringSettings.sizes[this.coloringSettings.sizesIndex].value;
        this._hideElements('sizeInfo');
        this._showElement(this._sizeInfo.nativeElement);
        this._settingsChange();
    }

    public handleSelectPhoto(): void {
        this._fileInput.nativeElement.click();
    }

    private _settingsChange(): void {
        this._coloringHelper.onSettingsChange.emit();
    }

    private _showElement(html: HTMLElement): void {
        this._timeId && clearTimeout(this._timeId);
        html.style.display = 'block';
        this._timeId = setTimeout(() => {
            this._hideElement(html);
        }, 2000);
    }

    private _hideElements(skip: string): void {
        skip !== 'saveInfo' && this._hideElement(this._saveInfo.nativeElement);
        skip !== 'coloredInfo' && this._hideElement(this._coloredInfo.nativeElement);
        skip !== 'qualityInfo' && this._hideElement(this._qualityInfo.nativeElement);
        skip !== 'sizeInfo' && this._hideElement(this._sizeInfo.nativeElement);
    }

    private _hideElement(html: HTMLElement): void {
        html.style.display = 'none';
    }
}