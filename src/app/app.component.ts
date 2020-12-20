import { Component, Input } from '@angular/core';

@Component({
    selector: 'main-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {
    @Input()
    public firstLoad = true;
}