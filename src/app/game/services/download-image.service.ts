import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";

const { fetch, URL, webkitURL } = window;

@Injectable({
    providedIn: 'root'
})
export class DownloadImageService {

    /**
     * Convert canvas to blob url
     */
    public canvasToUrl(canvas: HTMLCanvasElement): Observable<string> {
        return from(fetch(canvas.toDataURL())
            .then(res => res.blob())
            .then(blob => {
                return this._urlCreate(blob);
            }));
    }

    private _urlCreate(blob: Blob): string {
        const urlCreator = URL || webkitURL;
        return urlCreator.createObjectURL(blob);
    }

}