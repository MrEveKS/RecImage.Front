import { Component } from '@angular/core';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {

    public loading: boolean;
    public firstLoad = true;

    public onGameLoad(load: boolean): void {
        this.firstLoad = !load;
    }

    public gameLoading(loading: boolean): void {
        this.loading = loading;
    }

}