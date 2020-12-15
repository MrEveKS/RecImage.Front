import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { asyncScheduler, Observable, of, scheduled } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";

import { HttpService } from "../../services/http.service";

import { IRecColor } from "../models/rec-color.interface";

@Component({
    selector: 'point',
    styleUrls: ['./point.component.scss'],
    templateUrl: './point.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent implements OnInit {

    public loading: boolean;
    public firstLoad = true;
    public zoom: number;

    @Input()
    public files: FileList;
    @Input()
    public colorSize: number;
    @Input()
    public colored: boolean;
    @Input()
    public size: number;

    public points: Observable<string[][]> = of([]);
    public cellsColoredCells: { [key: string]: string };
    public updated: { [key: string]: boolean };
    public progress = 0;

    private _totalColors = 0;

    private _clicked: { [key: number]: boolean };
    private _worker: Worker;
    private _workerIsInit: boolean;

    constructor(private _http: HttpService,
        private _cdr: ChangeDetectorRef) {
        this._cdr.detach();
    }

    public ngOnInit(): void {
        if (typeof Worker !== 'undefined') {
            this._workerIsInit = true;
            this._worker = new Worker('./point.worker', {
                type: 'module',
            });

            this._worker.addEventListener('message',
                (message: MessageEvent) => {
                    this._updateCell(message.data);
                    this._updateProgress();
                });
        } else {
            this._workerIsInit = false;
        }
    }

    public resize(zoom: number): void {
        this.zoom = zoom;
        this._cdr.detectChanges();
    }

    public load(): void {
        this.loading = true;
        const fileToUpload = this.files.item(0) as File;
        this.points = this._http.postFile<IRecColor>(fileToUpload, {
            colorStep: this.colorSize, colored: this.colored, size: this.size
        })
            .pipe(
                switchMap((res: IRecColor) => {
                    this.progress = 0;
                    this.updated = {};
                    this._clicked = {};
                    this._totalColors = Object.keys(res.cellsColor).length;
                    this.cellsColoredCells = res.cellsColor;
                    return of(res.cells);
                }),
                catchError(err => {
                    console.error(err);
                    return of([]);
                }),
                finalize(() => {
                    this.loading = false;
                    this.firstLoad = false;
                    this._detectChangesAsync();
                })
            );
        this._cdr.detectChanges();
    }

    public spanClick(number: string): void {
        if (!number) return;
        if (this._clicked[number]) return;
        this._clicked[number] = true;
        if (this._workerIsInit) {
            this._worker.postMessage(number);
        } else {
            this._updateCell(number);
            this._updateProgress();
        }
    }

    private _updateCell(number: string): void {
        const color = this.cellsColoredCells[number];
        if (this.updated[color]) return;
        this.updated[color] = true;
    }

    private _updateProgress(): void {
        this.progress = Object.keys(this.updated).length / this._totalColors * 100;
        this._detectChangesAsync();
    }

    private _detectChangesAsync(): void {
        scheduled(of(this._cdr.detectChanges()), asyncScheduler);
    }
}