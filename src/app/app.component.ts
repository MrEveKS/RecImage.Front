import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {

    public loading: boolean;
    public showPreview = true;

    public hideFooterSelect$: Observable<boolean>;

    public constructor(router: Router) {
        this.hideFooterSelect$ = router.events
            .pipe(
                filter((event: RouterEvent) => event instanceof NavigationEnd),
                map((data: NavigationEnd) => data.url.indexOf('coloring') !== -1)
            );
    }

    public handleBack(): void {
        this.showPreview = true;
    }

    public onGameLoad(load: boolean): void {
        this.showPreview = !load;
    }

    public gameLoading(loading: boolean): void {
        this.loading = loading;
    }

}