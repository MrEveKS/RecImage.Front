import { Component } from '@angular/core';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {

    public loading: boolean;
    public showPreview = true;

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