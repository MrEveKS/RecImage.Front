import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
// interfaces
import { ISelectValue } from "src/app/models/select-value.interface";
import { IGameBaseSettings } from "../models/game-base-settings.interface";

const { clearTimeout, setTimeout } = window;
@Component({
    selector: 'game-menu',
    styleUrls: ['./game-menu.component.scss'],
    templateUrl: './game-menu.component.html',
})
export class GameMenuComponent implements OnInit {

    @Input()
    public zoom!: number;
    @Input()
    public imageFiles: FileList;

    @Output()
    public onSettingsChange = new EventEmitter<IGameBaseSettings>();
    @Output()
    public onSettingsSet = new EventEmitter<IGameBaseSettings>();
    @Output()
    public onZoomChange = new EventEmitter<number>();
    @Output()
    public onFilesSelect = new EventEmitter<FileList>();
    @Output()
    public onBackClick = new EventEmitter();

    public settings: IGameBaseSettings;

    public colorSteps!: ISelectValue<number>[];
    public sizes!: ISelectValue<number>[];
    public colorStepsIndex = 1;
    public sizesIndex = 2;

    @ViewChild('fileInput', { read: ElementRef })
    private _fileInput: ElementRef<HTMLInputElement>;

    @ViewChild('qualityInfo', { read: ElementRef })
    private _qualityInfo: ElementRef<HTMLDivElement>;

    @ViewChild('sizeInfo', { read: ElementRef })
    private _sizeInfo: ElementRef<HTMLDivElement>;

    private _timeId: number;

    public ngOnInit(): void {
        this._initialize();
        this.settings = {
            colorStep: this.colorSteps[this.colorStepsIndex].value,
            size: this.sizes[this.sizesIndex].value,
            colorSave: true,
            colored: true,
        };

        this.zoom = 100;
        this.resize(this.zoom);
        this._settingsSet();
    }

    public handleBack(): void {
        this.onBackClick.emit();
    }

    public resize(zoom: number): void {
        this.onZoomChange.emit(zoom);
    }

    public filesSelect(files: FileList): void {
        this.imageFiles = files;
        this.onFilesSelect.emit(files);
    }

    public handleColorSave(): void {
        this.settings.colorSave = !this.settings.colorSave;
        this._settingsChange();
    }

    public handleColored(): void {
        this.settings.colored = !this.settings.colored;
        this._settingsChange();
    }

    public handleQuality(): void {
        this.colorStepsIndex++;
        if (this.colorStepsIndex >= this.colorSteps.length) {
            this.colorStepsIndex = 0;
        }
        this.settings.colorStep = this.colorSteps[this.colorStepsIndex].value;
        this._sizeInfo.nativeElement.style.display = 'none';
        this._showElement(this._qualityInfo.nativeElement);
        this._settingsChange();
    }

    public handleSize(): void {
        this.sizesIndex++;
        if (this.sizesIndex >= this.sizes.length) {
            this.sizesIndex = 0;
        }
        this.settings.size = this.sizes[this.sizesIndex].value;
        this._qualityInfo.nativeElement.style.display = 'none';
        this._showElement(this._sizeInfo.nativeElement);
        this._settingsChange();
    }

    public handleSelectPhoto(): void {
        this._fileInput.nativeElement.click();
    }

    private _settingsChange(): void {
        this.onSettingsChange.emit(this.settings);
    }

    private _settingsSet(): void {
        this.onSettingsSet.emit(this.settings);
    }

    private _initialize(): void {
        this.colorSteps = [
            { title: 'Очень низкое', value: 30 },
            { title: 'Низкое', value: 24 },
            { title: 'Среднее', value: 18 },
            { title: 'Высокое', value: 12 },
            { title: 'Очень высокое', value: 6 },
        ];

        this.sizes = [
            { title: '50', value: 50 },
            { title: '100', value: 100 },
            { title: '150', value: 150 },
            { title: '200', value: 200 },
            { title: '250', value: 250 },
            { title: '300', value: 300 },
        ];
    }

    private _showElement(html: HTMLElement): void {
        this._timeId && clearTimeout(this._timeId);
        html.style.display = 'block';
        this._timeId = setTimeout(() => {
            html.style.display = 'none';
        }, 2000);
    }
}