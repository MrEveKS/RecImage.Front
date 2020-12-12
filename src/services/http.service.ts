import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IConvertOptions } from 'src/app/app.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private readonly _url = environment.apiUrl;
    private readonly _httpParams = {
        headers: { 'Access-Control-Allow-Origin': '*' }
    };

    constructor(private _http: HttpClient) {
    }

    postFile<T>(fileToUpload: File, options: IConvertOptions): Observable<T> {
        const endpoint = `${this._url}generate/convertToChar/`;
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        Object.keys(options).forEach((key) => {
            formData.append(key, options[key].toString());
        });

        return this._http
            .post<T>(endpoint, formData, this._httpParams);
    }
}