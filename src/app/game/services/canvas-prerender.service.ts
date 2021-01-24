import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";

const { setTimeout } = window;

@Injectable({
    providedIn: 'root'
})
export class CanvasPrerenderService {

    public get cells(): { [key: number]: HTMLCanvasElement } {
        return this._cells;
    }

    private readonly _prerenderCount = 2500;
    private readonly _cells: { [key: number]: HTMLCanvasElement } = {};
    private _rendered = false;

    public constructor(@Inject(DOCUMENT) private _document: Document) {
    }

    public prerender(size: number): Observable<void> {
        if (this._rendered) return of(null);
        this._rendered = true;
        return from(new Promise<void>((resolve) => {
            const fillPrerenderCells = () => {
                const cellCanvas = this._prerenderCell(size);
                for (let num = 0, length = this._prerenderCount; num < length; num += 1) {
                    const numCanvas = this._renderCellWithNumber(size, num, cellCanvas);
                    this._cells[num] = numCanvas;
                }
                resolve();
            };
            this._doAsync(fillPrerenderCells);
        }));
    }

    private _renderCellWithNumber(size: number, num: number, cellCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const halfSize = size / 2;
        const textResizeWidth = size - 8;
        const numCanvas = this._document.createElement('canvas') as HTMLCanvasElement;
        numCanvas.width = size;
        numCanvas.height = size;

        const context = numCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.drawImage(cellCanvas, 0, 0);
        context.font = "11px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = '#666';
        context.fillText(String(num), halfSize, halfSize, textResizeWidth);
        return numCanvas;
    }

    private _prerenderCell(size: number): HTMLCanvasElement {
        const smallSize = size - 4;
        const cellCanvas = this._document.createElement('canvas') as HTMLCanvasElement;
        cellCanvas.width = size;
        cellCanvas.height = size;

        const context = cellCanvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, size, size);
        context.strokeStyle = '#e6e6e6';
        context.fillStyle = '#e6e6e6';
        context.lineWidth = 1;
        context.strokeRect(2, 2, smallSize, smallSize);
        return cellCanvas;
    }

    private _doAsync(action: () => void): void {
        setTimeout(() => action());
    }

}