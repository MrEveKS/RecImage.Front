import { Component } from "@angular/core";

@Component({
    selector: 'develop-preview',
    styleUrls: ['./develop-preview.component.scss'],
    templateUrl: './develop-preview.component.html',
})
export class DevelopPreviewComponent {

    public hideDevelopment = false;

    public hideDev(): void {
        this.hideDevelopment = true;
    }

}