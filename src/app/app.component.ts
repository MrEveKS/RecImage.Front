import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ISelectValue } from './models/select-value.interface';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    public points: Observable<string[][]> = of([]);

    public colorSize: number;
    public zoom: number;
    public size: number;

    public files: FileList;
    public colored = true;

    public colorSizes: ISelectValue<number>[];
    public zooms: ISelectValue<number>[];
    public sizes: ISelectValue<number>[];

    public isNavbarCollapsed = true;

    public ngOnInit(): void {
        this._initialize();

        this.colorSize = this.colorSizes[1].value;
        this.size = this.sizes[2].value;
        this.zoom = this.zooms[4].value;
    }

    public filesSelect(files: FileList): void {
        this.files = files;
    }

    public changeColored(event: MouseEvent): void {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            this.colored = !this.colored;
        }
    }

    private _initialize(): void {
        this.colorSizes = [
            { title: 'Очень низкое', value: 30 },
            { title: 'Низкое', value: 20 },
            { title: 'Среднее', value: 15 },
            { title: 'Высокое', value: 10 },
            { title: 'Очень высокое', value: 7 },
        ];

        this.zooms = [
            { title: '10%', value: .1 },
            { title: '25%', value: .25 },
            { title: '50%', value: .50 },
            { title: '75%', value: .75 },
            { title: '100%', value: 1 },
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