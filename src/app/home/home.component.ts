import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppTitleService } from 'src/services/app-title.service';

import { ImageListService } from 'src/services/image-list.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {
  private _destroy = new ReplaySubject<number>(1);

  public constructor(
    titleService: AppTitleService,
    private _imageListService: ImageListService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    titleService.setTitle('главная страница');
  }

  public ngOnDestroy(): void {
    this._destroy.next(null);
    this._destroy.complete();
  }

  public randomSelect(): void {
    this._imageListService
      .getRandomId()
      .pipe(takeUntil(this._destroy))
      .subscribe(id => {
        this._router.navigate(['coloring', id], { relativeTo: this._route });
      });
  }
}
