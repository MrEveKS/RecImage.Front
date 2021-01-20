import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'preview',
    styleUrls: ['./preview.component.scss'],
    templateUrl: './preview.component.html',
})
export class PreviewComponent {

    @Output()
    public onFilesSelect = new EventEmitter<FileList>();
    @Output()
    public onImageSelect = new EventEmitter<number>();

    public filesSelect(files: FileList): void {
        this.onFilesSelect.emit(files);
    }

    public imageSelect(id: number): void {
        this.onImageSelect.emit(id);
    }

}