import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpService } from '../services/http.service';

import { IColoredChar } from './models/colored-char.interface';
import { ISelectValue } from './models/select-value.interface';
@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    public points: Observable<IColoredChar[][]>;

    public files: FileList;
    public size: number;

    public zoom: number;

    public zooms: ISelectValue<number>[];
    public sizes: ISelectValue<number>[];

    public loading: boolean;

    public isNavbarCollapsed = true;

    @ViewChildren('child')
    private _cells: QueryList<ElementRef<HTMLTableCellElement>>;

    constructor(private _http: HttpService,
        private _renderer: Renderer2) {
    }

    public ngOnInit(): void {
        this._initialize();

        this.size = this.sizes[4].value;
        this.zoom = this.zooms[4].value;
    }

    public changeImage(): void {
        this.loading = true;
        const fileToUpload = this.files.item(0);
        this.points = this._http.postFile<IColoredChar[][]>(fileToUpload, this.size)
            .pipe(
                catchError(err => {
                    console.error(err);
                    this.loading = false;
                    return of([]);
                }),
                finalize(() => this.loading = false)
            );

    }

    public filesSelect(files: FileList): void {
        this.files = files;
    }

    public spanClick(num: number, color: string): void {
        this._doAsync(() => {
            const number = num.toString();
            const spans = this._cells.filter((cell) => cell.nativeElement.getAttribute('color') === number);

            spans.forEach((ref) => {
                const span = ref.nativeElement;
                this._renderer.setStyle(span, 'color', color);
                this._renderer.setStyle(span, 'background-color', color);
                this._renderer.addClass(span, 'colored');
            });
        });
    }

    private _doAsync(action: () => void): void {
        setInterval(action, 0);
    }

    private _initialize(): void {
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