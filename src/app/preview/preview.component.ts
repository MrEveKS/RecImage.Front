import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'preview',
    styleUrls: ['./preview.component.scss'],
    templateUrl: './preview.component.html',
})
export class PreviewComponent {
    @ViewChild('fileInput', { read: ElementRef })
    private _fileInput: ElementRef<HTMLInputElement>;

    @Output()
    public onFileSelect = new EventEmitter<FileList>();

    public selectPhoto(): void {
        this._fileInput.nativeElement.click();
    }

    public filesSelect(files: FileList): void {
        this.onFileSelect.emit(files);
    }
}