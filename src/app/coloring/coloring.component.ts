import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'coloring',
    styleUrls: ['./coloring.component.scss'],
    templateUrl: './coloring.component.html',
})
export class ColoringComponent implements OnInit {

    private readonly _queryObservable: Observable<number | null>;

    constructor(route: ActivatedRoute) {
        this._queryObservable = route.params.pipe(
            map((params: Params) => params['id'])
        );
    }

    public ngOnInit(): void {
        this._queryObservable.subscribe((id) => {
            console.log('%cid: %O', 'color: red', id);
        });
    }
}