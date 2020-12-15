import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'preview',
    styleUrls: ['./preview.component.scss'],
    templateUrl: './preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
}