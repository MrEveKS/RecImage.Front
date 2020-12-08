import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    postFile<T>(fileToUpload: File, size: number): Observable<T> {
        const endpoint = `${this._url}generate/convertToChar/`;
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        formData.append('size', size.toString());
        return this._http
            .post<T>(endpoint, formData, this._httpParams);
    }
}