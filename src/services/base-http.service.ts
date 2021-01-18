import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class BaseHttpService {

    private readonly _apiUrl = environment.apiUrl;
    private readonly _controller;
    private readonly _httpParams = {
        headers: {
        }
    };

    constructor(controller: string, private _http: HttpClient) {
        this._controller = controller;
    }

    protected postFile<TEntity, UData>(fileToUpload: File, data: UData, method = 'postFile'): Observable<TEntity> {
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key].toString());
        });

        return this.post(method, formData);
    }

    protected post<TEntity, UData>(method: string, data: UData): Observable<TEntity> {
        const endpoint = `${this._apiUrl}${this._controller}/${method}/`;
        return this._http
            .post<TEntity>(endpoint, data, this._httpParams);
    }
}