import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'preview',
    styleUrls: ['./preview.component.css'],
    templateUrl: './preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
}