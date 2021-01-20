import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'image-select',
    styleUrls: ['./image-select.component.scss'],
    templateUrl: './image-select.component.html',
})
export class ImageSelectComponent {

    @Output()
    public onFilesSelect = new EventEmitter<FileList>();
    @Output()
    public onImageSelect = new EventEmitter<number>();

    @Input()
    public imageCount: number;

    @ViewChild('fileInput', { read: ElementRef })
    private _fileInput: ElementRef<HTMLInputElement>;

    public selectPhoto(): void {
        this._fileInput.nativeElement.click();
    }

    public filesSelect(files: FileList): void {
        this.onFilesSelect.emit(files);
    }

    public randemSelect(): void {
        const id = this._getRndInteger(1, Number(this.imageCount) + 1);
        this.onImageSelect.emit(id);
    }


    private _getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}