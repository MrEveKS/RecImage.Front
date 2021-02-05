import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ImageListService } from 'src/services/image-list.service';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent {

    public constructor(
        private _imageListService: ImageListService,
        private _route: ActivatedRoute,
        private _router: Router) {
    }

    public randomSelect(): void {
        this._imageListService.getRandomId().subscribe((id) => {
            this._router.navigate(['coloring', id], { relativeTo: this._route });
        });
    }

}