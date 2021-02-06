import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ImageListService } from 'src/services/image-list.service';

@Component({
    selector: 'footer-select',
    styleUrls: ['./footer-select.component.scss'],
    templateUrl: './footer-select.component.html',
})
export class FooterSelectComponent implements OnDestroy {

    private _destroy = new ReplaySubject<number>(1);

    public constructor(
        private _imageListService: ImageListService,
        private _route: ActivatedRoute,
        private _router: Router) {
    }

    public ngOnDestroy(): void {
        this._destroy.next(null);
        this._destroy.complete();
    }

    public randomSelect(): void {
        this._imageListService.getRandomId()
            .pipe(takeUntil(this._destroy))
            .subscribe((id) => {
                this._router.navigate(['coloring', id], { relativeTo: this._route });
            });
    }

}