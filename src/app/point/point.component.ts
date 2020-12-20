import { DOCUMENT } from "@angular/common";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

import { HttpService } from "../../services/http.service";

import { IColRow } from "../models/col-row.interface";
import { IPointOptions } from "../models/point-options.interface";
import { IRecColor } from "../models/rec-color.interface";
import { IMenuSettings } from "../point-menu/point-menu.component";

@Component({
    selector: 'point',
    styleUrls: ['./point.component.scss'],
    templateUrl: './point.component.html',
})
export class PointComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @Input()
    public firstLoad;

    public loading: boolean;
    public zoom: number;

    public colorPoint: { [key: string]: IColRow[] } = {};

    @Output()
    public onProgressUpdate = new EventEmitter<number>();
    @Output()
    public onFileSelectEmmit = new EventEmitter<FileList>();

    private _totalColors = 0;
    private _currentUpdated: { [key: string]: boolean } = {};
    private _updated: { [key: string]: boolean } = {};

    @ViewChild('canvasContainer', { read: ElementRef })
    private _canvasContainer: ElementRef<HTMLDivElement>;
    @ViewChild('container', { read: ElementRef })
    private _container: ElementRef<HTMLCanvasElement>;
    private _context: CanvasRenderingContext2D;

    private _currentOptions: IPointOptions = {} as IPointOptions;
    private _defaultRecSize = 25;

    private _updatePosition: boolean;

    /**
     * fileName colorSize size colored IRecColor
     */
    private _cash: { [key: string]: { [key: number]: { [key: number]: { [key: string]: IRecColor } } } };

    private readonly _defaultView: WindowProxy;

    constructor(private _http: HttpService,
        private _rendered: Renderer2,
        @Inject(DOCUMENT) document: Document) {
        this._defaultView = document.defaultView;
    }

    public ngAfterViewChecked(): void {
        if (!this._updatePosition || this.firstLoad) return;
        this._updatePosition = false;
        this._updateCanvasPosition();
    }

    public ngAfterViewInit(): void {
        this._context = this._container.nativeElement
            .getContext('2d', { alpha: false });
        this._context.globalCompositeOperation = 'source-over';
    }

    public ngOnInit(): void {
        this._cash = {};
    }

    public resize(zoom: number): void {
        this._updatePosition = true;
        this.zoom = zoom;
    }

    public load(options: IMenuSettings): void {
        this.loading = true;
        const fileToUpload = options.files.item(0) as File;
        if (this._currentOptions.fileName !== fileToUpload.name) {
            this._updated = {}
        }

        this._currentOptions = {
            fileName: fileToUpload.name,
            colorSize: options.colorSize,
            colored: options.colored,
            size: options.size
        };
        const fromCash = this._loadFromCash();

        (fromCash
            ? of(fromCash)
            : this._http.postFile<IRecColor>(fileToUpload, {
                colorStep: options.colorSize, colored: options.colored, size: options.size
            })).pipe(
                catchError((error: Error) => {
                    this.loading = false;
                    console.log(error);
                    return of(null);
                }),
                finalize(() => {
                    this.loading = false;
                    options.colorSave && this._updateProgress();
                })
            )
            .subscribe((res: IRecColor) => {
                if (!res) {
                    return;
                }
                this._totalColors = Object.keys(res.cellsColor).length;
                this._saveToCash(res);
                this._emptyData(options.colorSave);
                this._generateColorPoint();
                this._resizeCanvas();
                this._generateCanvas();
                this.firstLoad = false;
            });
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

    public previewFilesSelect(files: FileList): void {
        this.onFileSelectEmmit.emit(files);
    }

    private _resizeCanvas(): void {
        const canvas = this._container.nativeElement;
        const points = this._loadFromCash().cells;

        const height = points.length * this._defaultRecSize;
        const width = points[0].length * this._defaultRecSize;
        canvas.height = height;
        canvas.width = width;
        if (this.zoom !== 100) {
            this._canvasPositionChange({ canvasWidth: width * this.zoom / 100, canvasHeight: height * this.zoom / 100 });
        }
    }

    private _generateColorPoint(): void {
        const recColor = this._loadFromCash();
        this.colorPoint = {};
        const cells = recColor.cells;
        const cellsColor = recColor.cellsColor;
        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                const num = cells[row][col];
                const color = cellsColor[num];
                !this.colorPoint[color] && (this.colorPoint[color] = []);
                this.colorPoint[color].push({ col, row, num });
            }
        }
    }

    private _generateCanvas(): void {
        const size: number = this._defaultRecSize;
        const updated: { [key: string]: boolean } = this._updated;
        const colorPoint: { [key: string]: IColRow[] } = this.colorPoint;
        const updatedColors = Object.keys(updated).filter((key) => updated[key]);
        const colors = Object.keys(colorPoint).filter((key) => updatedColors.indexOf(key) === -1);

        const context = this._context;

        for (let index = 0, length = updatedColors.length; index < length; index += 1) {
            const color = updatedColors[index];
            const points = colorPoint[color];
            if (!points) continue;
            context.fillStyle = color;
            for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
                const point = points[pointIndex];
                const x = point.col * size;
                const y = point.row * size;

                context.fillRect(x, y, size, size);
                this._currentUpdated[color] = true;
            }
        }

        const bigNumber = 1000;
        for (let index = 0; index < colors.length; index++) {
            const color = colors[index];
            const points = colorPoint[color];
            const big = points.filter((p) => p.num >= bigNumber);
            const small = points.filter((p) => p.num < bigNumber);

            context.strokeStyle = '#ccc';

            context.font = "9px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";

            this._fillContext(big, size);

            context.font = "11px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";

            this._fillContext(small, size);
        }
    }

    private _fillContext(points: IColRow[], size: number) {
        for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
            const point = points[pointIndex];
            const x = point.col * size;
            const y = point.row * size;

            this._context.fillStyle = '#fff';
            this._context.fillRect(x, y, size, size);
            this._context.fillStyle = '#666';

            this._context.strokeRect(x + 2, y + 2, size - 4, size - 4);
            this._context.fillText(point.num.toString(), (x - size / 2) + size, (y - size / 2) + size);
        }
    }

    private _emptyData(colorSave: boolean): void {
        this._progressEmit(0);
        this.colorPoint = {};
        this._currentUpdated = {};
        !colorSave && (this._updated = {});
    }

    private _getCursorPosition(canvas: HTMLCanvasElement, $event: MouseEvent)
        : { x: number; y: number; } {
        const rect = canvas.getBoundingClientRect();
        const x = $event.clientX - rect.left;
        const y = $event.clientY - rect.top;
        return { x, y };
    }

    private _updateProgress(): void {
        this._progressEmit(Object.keys(this._currentUpdated).length / this._totalColors * 100);
    }

    private _progressEmit(progress: number): void {
        this.onProgressUpdate.emit(progress);
    }

    private _loadFromCash(): IRecColor {
        if (!this._cash[this._currentOptions.fileName]
            || !this._cash[this._currentOptions.fileName][this._currentOptions.colorSize]
            || !this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size]
            || !this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size][this._currentOptions.colored.toString()]) return null;
        return this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size][this._currentOptions.colored.toString()] || null;
    }

    private _saveToCash(res: IRecColor): void {
        const boolKey = this._currentOptions.colored.toString();
        if (!this._cash[this._currentOptions.fileName]) {
            this._cash[this._currentOptions.fileName] = {};
            this._cash[this._currentOptions.fileName][this._currentOptions.colorSize] = {};
            this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size] = {};
        } else if (!this._cash[this._currentOptions.fileName][this._currentOptions.colorSize]) {
            this._cash[this._currentOptions.fileName][this._currentOptions.colorSize] = {};
            this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size] = {};
        } else if (!this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size]) {
            this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size] = {};
        }

        this._cash[this._currentOptions.fileName][this._currentOptions.colorSize][this._currentOptions.size][boolKey] = res;
    }

    private _updateCanvasPosition(): void {
        if (this.zoom === 100) return;
        const canvas = this._container.nativeElement;
        const canvasWidth = +canvas.width * this.zoom / 100;
        const canvasHeight = +canvas.height * this.zoom / 100;
        this._canvasPositionChange({ canvasWidth, canvasHeight })
    }

    private _canvasPositionChange({ canvasWidth, canvasHeight }): void {
        const canvas = this._container.nativeElement;
        const canvasContainer = this._canvasContainer.nativeElement;
        const canvasContainerWidth = +canvasContainer.clientWidth;
        const canvasContainerHeight = +canvasContainer.clientHeight;
        const styleValues = this._defaultView.getComputedStyle(canvas);
        const marginTop = parseInt(styleValues.getPropertyValue('margin-top'));
        const marginLeft = parseInt(styleValues.getPropertyValue('margin-left'));

        const left = canvasWidth < canvasContainerWidth
            ? `${(canvasContainerWidth - canvasWidth) / 2 - marginLeft}px`
            : 'auto';
        const top = canvasHeight < canvasContainerHeight
            ? `${(canvasContainerHeight - canvasHeight) / 2 - marginTop}px`
            : 'auto';

        this._rendered.setStyle(canvas, 'left', left);
        this._rendered.setStyle(canvas, 'top', top);
    }
}