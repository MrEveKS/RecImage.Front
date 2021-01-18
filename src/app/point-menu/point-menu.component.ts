import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ISelectValue } from "../models/select-value.interface";

export interface IMenuSettings {
    colorSize: number;
    size: number;
    files: FileList;
    colored: boolean;
    colorSave: boolean;
}

@Component({
    selector: 'point-menu',
    styleUrls: ['./point-menu.component.scss'],
    templateUrl: './point-menu.component.html',
})
export class PointMenuComponent implements OnInit {

    @Input()
    public firstLoad;

    @Input()
    public zoomEnabled: boolean;

    public zoom!: number;
    public menuSettins: IMenuSettings = {} as IMenuSettings;

    public colorSizes!: ISelectValue<number>[];
    public sizes!: ISelectValue<number>[];

    @Output()
    public onLoadClick = new EventEmitter<IMenuSettings>();
    @Output()
    public onZoomChange = new EventEmitter<number>();

    public ngOnInit(): void {
        this._initialize();

        this.menuSettins.colorSize = this.colorSizes[1].value;
        this.menuSettins.size = this.sizes[2].value;
        this.menuSettins.colorSave = true;
        this.menuSettins.colored = true;
        this.zoom = 100;

        this.resize(this.zoom);
    }

    public onClick(): void {
        this.onLoadClick.emit(this.menuSettins);
    }

    public resize(zoom: number): void {
        this.onZoomChange.emit(zoom);
    }

    public filesSelect(files: FileList): void {
        this.menuSettins.files = files;
    }

    public previewFilesSelect(files: FileList): void {
        this.menuSettins.files = files;
        this.onClick();
    }

    private _initialize(): void {
        this.colorSizes = [
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