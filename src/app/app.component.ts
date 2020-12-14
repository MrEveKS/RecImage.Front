import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { HttpService } from '../services/http.service';

import { ISelectValue } from './models/select-value.interface';
import { IRecColor } from './models/rec-color.interface';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    public points: Observable<string[][]> = of([]);

    public files: FileList;
    public size: number;
    public zoom: number;
    public colored = true;
    public colorSize: number;

    public colorSizes: ISelectValue<number>[];
    public zooms: ISelectValue<number>[];
    public sizes: ISelectValue<number>[];

    public loading: boolean;
    public progress = 0;
    public firstLoad = true;
    public cellsColoredCells: { [key: string]: string };
    public updated: { [key: string]: boolean };

    public isNavbarCollapsed = true;

    private _totalColors = 0;

    constructor(private _http: HttpService, private _cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this._initialize();

        this.colorSize = this.colorSizes[1].value;
        this.size = this.sizes[2].value;
        this.zoom = this.zooms[4].value;
    }

    public changeImage(): void {
        this.loading = true;
        const fileToUpload = this.files.item(0);
        this.points = this._http.postFile<IRecColor>(fileToUpload, {
            colorStep: this.colorSize, colored: this.colored, size: this.size
        })
            .pipe(
                catchError(err => {
                    console.error(err);
                    this.loading = false;
                    return of([]);
                }),
                switchMap((res: IRecColor) => {
                    this.progress = 0;
                    this.updated = {};
                    this._totalColors = Object.keys(res.cellsColor).length;
                    this.cellsColoredCells = res.cellsColor;
                    return of(res.cells);
                }),
                catchError(err => {
                    console.error(err);
                    this.loading = false;
                    return of([]);
                }),
                finalize(() => {
                    console.log('finalize');
                    this.loading = false;
                    this.firstLoad = false;
                })
            );
    }

    public filesSelect(files: FileList): void {
        this.files = files;
    }

    public spanClick(number: string): void {
        if (!number) return;
        setTimeout(() => {
            const color = this.cellsColoredCells[number];
            if (this.updated[color]) return;
            this.updated[color] = true;
            this.progress = Object.keys(this.updated).length / this._totalColors * 100;
            this._cdr.detectChanges();
        }, 0);
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