import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";

import { HttpService } from "../../services/http.service";

import { IRecColor } from "../models/rec-color.interface";

@Component({
    selector: 'point',
    styleUrls: ['./point.component.css'],
    templateUrl: './point.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointComponent {

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

    constructor(private _http: HttpService, private _cdr: ChangeDetectorRef) {
        this._cdr.detach();
    }

    public resize(zoom: number): void {
        this.zoom = zoom;
        this._cdr.detectChanges();
    }

    public load(): void {
        this.loading = true;
        const fileToUpload = this.files.item(0);
        this.points = this._http.postFile<IRecColor>(fileToUpload, {
            colorStep: this.colorSize, colored: this.colored, size: this.size
        })
            .pipe(
                switchMap((res: IRecColor) => {
                    this.progress = 0;
                    this.updated = {};
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
                    this._cdr.detectChanges();
                })
            );
        this._cdr.detectChanges();
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
}