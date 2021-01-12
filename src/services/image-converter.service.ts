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

    public convertToPoint<T>(fileToUpload: File, options: IConvertOptions): Observable<T> {
        return this.postFile(fileToUpload, options, 'convertToChar');
    }

}