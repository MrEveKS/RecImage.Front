import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpService, IColoredChar } from './http.service';

export interface ISelectValue<TValue> {
    title: string;
    value: TValue
}

@Component({
    selector: 'my-app',
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

    @ViewChild('container', { read: ElementRef })
    private _container: ElementRef<HTMLSpanElement>;
    @ViewChildren('child')
    private _cells: QueryList<ElementRef<HTMLTableCellElement>>;
    @ViewChild('zoomSpan', { read: ElementRef })
    private _zoomSpan: ElementRef<HTMLSpanElement>;

    private _overTime: NodeJS.Timeout;

    constructor(private _http: HttpService,
        private _renderer: Renderer2,
        @Inject(DOCUMENT) private _document: Document) {
    }

    public ngOnInit(): void {
        this._initialize();

        this.size = this.sizes[4].value;;
        this.zoom = this.zooms[4].value;
    }

    public changeImage() {
        this.loading = true;
        const fileToUpload = this.files.item(0);
        this.points = this._http.postFile(fileToUpload, this.size)
            .pipe(
                catchError(err => {
                    console.error(err);
                    this.loading = false;
                    return of([]);
                }),
                finalize(() => this.loading = false)
            );

    }

    public filesSelect(files: FileList) {
        this.files = files;
    }

    public hoverElement(num: number, color: string): void {
        const wait = 2000;
        if (this._overTime) clearTimeout(this._overTime);
        const spanSize = 35;

        this._overTime = setTimeout(() => {
            console.log(num);
            const span = this._zoomSpan.nativeElement;
            const targets = this._document.querySelectorAll<HTMLTableCellElement>('td:hover');
            if (!targets || !targets.length) return;
            const targetCell = targets[0];
            const container = this._container.nativeElement;

            const top = (targetCell.offsetTop + targetCell.offsetHeight / 2) * this.zoom - container.scrollTop - spanSize / 2;
            const left = (targetCell.offsetLeft + targetCell.offsetWidth / 2) * this.zoom - container.scrollLeft - spanSize / 2;
            this._renderer.setStyle(span, 'top', `${top}px`);
            this._renderer.setStyle(span, 'left', `${left}px`);

            this._renderer.setStyle(span, 'display', 'block');
            this._renderer.setAttribute(span, 'zNum', num.toString());
            this._renderer.setAttribute(span, 'zColor', color);
            this._renderer.setProperty(span, 'innerText', num);
        }, wait);
    }

    public overElement(): void {
        if (this._overTime) clearTimeout(this._overTime);
    }

    public overSpan(): void {
        const span = this._zoomSpan.nativeElement;
        this._renderer.removeAttribute(span, 'zNum');
        this._renderer.removeAttribute(span, 'zColor');
        this._renderer.setStyle(span, 'display', 'none');
        this._renderer.setProperty(span, 'innerText', '');
    }

    public spanZoomClick(): void {
        const span = this._zoomSpan.nativeElement;
        const num = +span.getAttribute('zNum');
        const color = span.getAttribute('zColor');
        this.spanClick(num, color);
    }

    public spanClick(num: number, color: string): void {
        if (this._overTime) clearTimeout(this._overTime);
        this._doAsync(() => {
            const number = num.toString();
            const spans = this._cells.filter((cell) => cell.nativeElement.getAttribute('color') === number);

            spans.forEach((ref) => {
                const span = ref.nativeElement;
                this._renderer.setStyle(span, 'color', color);
                this._renderer.setStyle(span, 'background-color', color);
                this._renderer.addClass(span, 'colored');
            });
            this.overSpan();
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