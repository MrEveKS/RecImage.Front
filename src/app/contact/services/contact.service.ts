import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {BaseHttpService} from 'src/services/base-http.service';

import {IContactMessage} from '../models/contact-message.interface';

@Injectable({
    providedIn: 'root'
})
export class ContactService extends BaseHttpService {

    constructor(http: HttpClient) {
        super('contact', http);
    }

    public postMessage(message: IContactMessage): Observable<void> {
        return this.post<void, unknown>('post', message);
    }

}