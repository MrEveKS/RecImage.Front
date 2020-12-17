import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ISelectValue } from './models/select-value.interface';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    public points: Observable<string[][]> = of([]);

    public colorSize!: number;
    public zoom!: number;
    public size!: number;

    public files!: FileList;
    public colored = true;
    public colorSave = true;

    public colorSizes!: ISelectValue<number>[];
    public sizes!: ISelectValue<number>[];

    public isNavbarCollapsed = true;

    public ngOnInit(): void {
        this._initialize();

        this.colorSize = this.colorSizes[1].value;
        this.size = this.sizes[2].value;
        this.zoom = 100;
    }

    public filesSelect(files: FileList): void {
        this.files = files;
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