import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpService } from '../services/http.service';

import { ISelectValue } from './models/select-value.interface';
import { IRecColor } from './models/rec-color.interface';

export interface IConvertOptions {
    colored: boolean;
    size: number;
    colorStep: number;
}

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {

    public points: Observable<string[][]> = of([]);

    public files: FileList;
    public size: number;
    public zoom: Observable<number>;
    public colored = true;
    public colorSize: number;

    public colorSizes: ISelectValue<number>[];
    public zooms: ISelectValue<number>[];
    public sizes: ISelectValue<number>[];

    public loading: boolean;
    public progress = 0;

    public isNavbarCollapsed = true;

    @ViewChild('tableContainer', { read: ElementRef })
    private _container: ElementRef<HTMLTableElement>;
    @ViewChildren('child')
    private _cells: QueryList<ElementRef<HTMLTableCellElement>>;
    private _colCell: { [key: string]: HTMLTableCellElement[] };

    private _coloredCells: { [key: string]: string };
    private _updated: { [key: string]: boolean };
    private _totalColors = 0;

    constructor(private _http: HttpService,
        private _renderer: Renderer2,
        private cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this._initialize();

        this.colorSize = this.colorSizes[1].value;
        this.size = this.sizes[2].value;
        this.zoom = of(this.zooms[4].value);
    }

    public ngAfterViewInit(): void {
        this._containerResize();
        this._cells.notifyOnChanges = this._gropCells.bind(this);
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
                    this._updated = {};
                    this._totalColors = Object.keys(res.cellsColor).length;
                    this._coloredCells = res.cellsColor;
                    return of(res.cells);
                }),
                catchError(err => {
                    console.error(err);
                    this.loading = false;
                    return of([]);
                }),
                finalize(() => this.loading = false)
            );
    }

    public updateZoom(zoom: number): void {
        this.zoom = of(zoom);
        this._containerResize();
    }

    public filesSelect(files: FileList): void {
        this.files = files;
    }

    public spanClick(number: string): void {
        if (!number) return;
        const color = this._coloredCells[number];
        if (this._updated[color]) return;
        this._updated[color] = true;
        this.progress = Object.keys(this._updated).length / this._totalColors * 100;
        from(this._colCell[number])
            .pipe(
                tap((span) => {
                    this._renderer.setStyle(span, 'color', color);
                    this._renderer.setStyle(span, 'background-color', color);
                    this._renderer.addClass(span, 'colored');
                })
            )
            .subscribe();
    }

    public changeColored(event: MouseEvent): void {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            this.colored = !this.colored;
        }
    }

    private _gropCells(): void {
        this._colCell = {};
        from(this._cells.map<HTMLTableCellElement>((ref) => ref.nativeElement))
            .pipe(
                tap((cell) => {
                    const colIndex = cell.getAttribute('color');
                    !this._colCell[colIndex] && (this._colCell[colIndex] = []);
                    this._colCell[colIndex].push(cell);
                })
            )
            .subscribe();
    }

    private _containerResize(): void {
        const container = this._container.nativeElement;
        this.zoom.pipe(
            tap((val) => {
                this._renderer.setStyle(container, 'transform', `scale(${val})`);
                this.cdr.detectChanges();
            })
        ).subscribe();
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