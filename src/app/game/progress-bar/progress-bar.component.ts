import { Component } from "@angular/core";

@Component({
    selector: 'progress-bar',
    styleUrls: ['./progress-bar.component.scss'],
    templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent {

    public progress!: number;

    public progressUpdate(progress: number): void {
        this.progress = progress;
    }

}