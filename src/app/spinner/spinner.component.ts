import { Component } from "@angular/core";

@Component({
    selector: 'spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html',
})
export class SpinnerComponent {

    public hideDevelopment = false;

    public hideDev(): void {
        this.hideDevelopment = true;
        console.log(this.hideDevelopment);
    }

}