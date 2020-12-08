import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IColoredChar {
    character: string;
    webColor: string;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private _http: HttpClient) {
    }

    postFile(fileToUpload: File, size: number): Observable<IColoredChar[][]> {
        const endpoint = 'http://back.u1234490.plsk.regruhosting.ru/api/generate/convertToChar/';
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        formData.append('size', size.toString());
        return this._http
            .post<IColoredChar[][]>(endpoint, formData, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

}