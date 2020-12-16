import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

import { HttpService } from "../../services/http.service";

import { IRecColor } from "../models/rec-color.interface";
export interface IColRow {
    col: number;
    row: number;
}

@Component({
    selector: 'point',
    styleUrls: ['./point.component.scss'],
    templateUrl: './point.component.html',
})
export class PointComponent implements OnInit, AfterViewInit {

    public loading: boolean;
    public firstLoad = true;
    public zoom = 100;

    @Input()
    public files: FileList;
    @Input()
    public colorSize: number;
    @Input()
    public colored: boolean;
    @Input()
    public size: number;
    @Input()
    public colorSave;

    public colorPoint: { [key: string]: IColRow[] } = {};
    public progress = 0;

    private _totalColors = 0;
    private _currentUpdated: { [key: string]: boolean } = {};
    private _updated: { [key: string]: boolean } = {};

    private _worker: Worker;
    // private _workerIsInit = false;

    _
    @ViewChild('container', { read: ElementRef })
    private _container: ElementRef<HTMLCanvasElement>;
    private _context: CanvasRenderingContext2D;

    private _loadedFileName: string;
    private _defaultRecSize = 25;

    /**
     * fileName colorSize size colored IRecColor
     */
    private _cash: { [key: string]: { [key: number]: { [key: number]: { [key: string]: IRecColor } } } };

    constructor(private _http: HttpService) {
    }
    ngAfterViewInit(): void {
        this._context = this._container.nativeElement
            .getContext('2d', { alpha: false });
        this._context.globalCompositeOperation = 'source-over';
    }

    public ngOnInit(): void {
        this._cash = {};

        if (typeof Worker !== 'undefined') {
            // this._workerIsInit = true;
            this._worker = new Worker('./point.worker', {
                type: 'module',
            });

            this._worker.addEventListener('message',
                (message: MessageEvent) => {
                    //this._updateCell(message.data);
                    this._updateProgress();
                });
        } else {
            // this._workerIsInit = false;
        }
    }

    public resize(zoom: number): void {
        this.zoom = zoom;
    }

    public load(): void {
        this.loading = true;
        const fileToUpload = this.files.item(0) as File;
        this._loadedFileName = fileToUpload.name;
        const fromCash = this._loadFromCash();

        (fromCash
            ? of(fromCash)
            : this._http.postFile<IRecColor>(fileToUpload, {
                colorStep: this.colorSize, colored: this.colored, size: this.size
            })).pipe(catchError((error: Error) => {
                this.loading = false;
                console.log(error);
                return of({});
            }))
            .subscribe((res: IRecColor) => {
                this._totalColors = Object.keys(res.cellsColor).length;
                this._saveToCash(res);
                this._emptyData();
                this._resizeConvas();
                this._initilizePoints();

                this.loading = false;
                this.firstLoad = false;
                this.colorSave && this._updateProgress();
            });
    }

    private _resizeConvas(): void {
        const convas = this._container.nativeElement;
        const points = this._loadFromCash().cells;

        convas.height = points.length * this._defaultRecSize;
        convas.width = points[0].length * this._defaultRecSize;
    }

    private _initilizePoints(): void {
        const recColor = this._loadFromCash();
        const cells = recColor.cells;
        const size = this._defaultRecSize;
        const context = this._context;
        const cellsColor = recColor.cellsColor;

        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                const num = cells[row][col];
                const color = cellsColor[num];
                !this.colorPoint[color] && (this.colorPoint[color] = []);
                this.colorPoint[color].push({ col, row });

                const x = col * size;
                const y = row * size;

                if (this._updated[color]) {
                    context.fillStyle = color;
                    context.fillRect(x, y, size, size);
                    this._currentUpdated[color] = true;
                } else {
                    context.fillStyle = '#fff';
                    context.fillRect(x, y, size, size);
                    context.fillStyle = '#666';
                    this._context.strokeStyle = '#ccc';
                    context.lineWidth = 1;
                    if (num > 999) {
                        context.font = "9px Arial";
                        context.textAlign = "center";
                        context.textBaseline = "middle";
                    } else {
                        context.font = "11px Arial";
                        context.textAlign = "center";
                        context.textBaseline = "middle";
                    }
                    context.strokeRect(x + 2, y + 2, size - 4, size - 4);
                    context.fillText(num.toString(), (x - size / 2) + size, (y - size / 2) + size);
                }
            }
        }
    }

    private _emptyData(): void {
        this.progress = 0;
        this.colorPoint = {};
        this._currentUpdated = {};
        !this.colorSave && (this._updated = {});
    }

    public onCkick($event: MouseEvent): void {
        const recColor = this._loadFromCash();
        const size = this._defaultRecSize;
        const zoomSize = this._defaultRecSize * this.zoom / 100;
        const context = this._context;
        const position = this._getCursorPosition(this._container.nativeElement, $event);

        const row = Math.floor((position.y - position.y % zoomSize) / zoomSize);
        const col = Math.floor((position.x - position.x % zoomSize) / zoomSize);
        const num = recColor.cells[row][col];
        const color = recColor.cellsColor[num];
        if (this._updated[color]) return;
        this._updated[color] = true;
        this._currentUpdated[color] = true;

        context.fillStyle = color;
        for (let index = 0; index < this.colorPoint[color].length; index++) {
            const cor = this.colorPoint[color][index];
            context.fillRect(cor.col * size, cor.row * size, size, size);
        }

        this._updateProgress();
    }

    private _getCursorPosition(canvas: HTMLCanvasElement, $event: MouseEvent)
        : { x: number; y: number; } {
        const rect = canvas.getBoundingClientRect();
        const x = $event.clientX - rect.left;
        const y = $event.clientY - rect.top;
        return { x, y };
    }

    private _updateProgress(): void {
        this.progress = Object.keys(this._currentUpdated).length / this._totalColors * 100;
    }

    private _loadFromCash(): IRecColor {
        if (!this._cash[this._loadedFileName]
            || !this._cash[this._loadedFileName][this.colorSize]
            || !this._cash[this._loadedFileName][this.colorSize][this.size]
            || !this._cash[this._loadedFileName][this.colorSize][this.size][this.colored.toString()]) return null;
        return this._cash[this._loadedFileName][this.colorSize][this.size][this.colored.toString()] || null;
    }

    private _saveToCash(res: IRecColor): void {
        const boolKey = this.colored.toString();
        if (!this._cash[this._loadedFileName]) {
            this._cash[this._loadedFileName] = {};
            this._cash[this._loadedFileName][this.colorSize] = {};
            this._cash[this._loadedFileName][this.colorSize][this.size] = {};
        } else if (!this._cash[this._loadedFileName][this.colorSize]) {
            this._cash[this._loadedFileName][this.colorSize] = {};
            this._cash[this._loadedFileName][this.colorSize][this.size] = {};
        } else if (!this._cash[this._loadedFileName][this.colorSize][this.size]) {
            this._cash[this._loadedFileName][this.colorSize][this.size] = {};
        }

        this._cash[this._loadedFileName][this.colorSize][this.size][boolKey] = res;
    }
}