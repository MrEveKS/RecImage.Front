import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';

import { IConvertOptions } from 'src/app/models/convert-options.interface';

@Injectable({
    providedIn: 'root'
})
export class ImageConverterService extends BaseHttpService {

    constructor(http: HttpClient) {
        super('generate', http);
    }

    public convertToPoints<T>(fileToUpload: File, options: IConvertOptions): Observable<T> {
        return this.postFile(fileToUpload, options, 'convertToPoints');
    }

    public convertToPointsById<T>(options: IConvertOptions): Observable<T> {
        return this.post<T, IConvertOptions>('convertToPointsById', options);
    }

}