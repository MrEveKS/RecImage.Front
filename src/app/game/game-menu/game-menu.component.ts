import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// interfaces
import { ISelectValue } from "src/app/models/select-value.interface";
import { IGameBaseSettings } from "../models/game-base-settings.interface";

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
    public onZoomChange = new EventEmitter<number>();
    @Output()
    public onFilesSelect = new EventEmitter<FileList>();

    public settings: IGameBaseSettings;

    public colorSteps!: ISelectValue<number>[];
    public sizes!: ISelectValue<number>[];

    public ngOnInit(): void {
        this._initialize();
        this.settings = {
            colorStep: this.colorSteps[1].value,
            size: this.sizes[2].value,
            colorSave: true,
            colored: true,
        };

        this.zoom = 100;
        this.resize(this.zoom);
        this.settingsChange();
    }

    public resize(zoom: number): void {
        this.onZoomChange.emit(zoom);
    }

    public settingsChange(): void {
        this.onSettingsChange.emit(this.settings);
    }

    public filesSelect(files: FileList): void {
        this.imageFiles = files;
        this.onFilesSelect.emit(files);
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
}