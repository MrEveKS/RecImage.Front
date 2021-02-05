import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';

@Injectable({
    providedIn: 'root'
})
export class ImageListService extends BaseHttpService {

    constructor(http: HttpClient) {
        super('images', http);
    }

    public getAll<T>(): Observable<T> {
        return this.post<T, unknown>('getAll', {})
    }

    public getRandomId(): Observable<number> {
        return this.post<number, unknown>('getRandomId', {})
    }

}