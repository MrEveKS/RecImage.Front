import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";

import { ImageConverterService } from "./services/image-converter.service";

// interfaces
import { IGameSettings } from "./models/game-settings.interface";
import { IRecColor } from "./models/rec-color.interface";
import { InMemoryCashService } from "./services/in-memory-cash.service";
import { ICashSettings } from "./models/cash-settings.interface";

export interface IRecUpdate {
    recColor: IRecColor;
    clear: boolean;
    colorSave: boolean;
}

@Component({
    selector: 'game',
    styleUrls: ['./game.component.scss'],
    templateUrl: './game.component.html',
})
export class GameComponent implements OnDestroy {

    @Output()
    public onGameLoad = new EventEmitter<boolean>();
    @Output()
    public onGameLoading = new EventEmitter<boolean>();
    @Output()
    public onBackClick = new EventEmitter();

    public settings!: ICashSettings;
    public imageFiles!: FileList;

    public updatePoints: Subject<Observable<IRecUpdate>> = new Subject<Observable<IRecUpdate>>();

    public constructor(private _http: ImageConverterService,
        private _cash: InMemoryCashService) {
    }

    public ngOnDestroy(): void {
        this.updatePoints.complete();
    }

    public handleBack(): void {
        this.onBackClick.emit();
    }

    public filesSelect(files: FileList): void {
        this.imageFiles = files;
        this._fileLoad(files);
    }

    public imageSelect(id: number): void {
        this._loadById(id);
    }

    public settingsChange(settings: IGameSettings): void {
        this.settingsSet(settings);

        if (this.settings.fileName) {
            this.filesSelect(this.imageFiles);
        } else {
            this._loadById(this.settings.imageId);
        }
    }

    public settingsSet(settings: IGameSettings): void {
        this.settings = { ...this.settings, ...settings };
    }

    private _loadById(id: number) {
        const clear = this.settings.imageId !== id;
        this.settings = { ...this.settings, fileName: null, imageId: id };
        this._load(clear);
    }

    private _fileLoad(files: FileList): void {
        const fileToUpload = files.item(0) as File;
        const clear = this.settings.fileName !== fileToUpload.name;
        this.settings = { ...this.settings, fileName: fileToUpload.name, imageId: null };
        this._load(clear, fileToUpload);
    }

    private _load(clear: boolean, fileToUpload?: File): void {
        this._loading(true);
        const fromCash = this._cash.loadFromCash(this.settings);

        const contentTask = (fromCash
            ? of(fromCash)
            : fileToUpload
                ? this._http.convertToPoints<IRecColor>(fileToUpload, this.settings)
                : this._http.convertToPointsById<IRecColor>(this.settings)
        ).pipe(
            catchError((error: Error) => {
                this._loading(false);
                console.error(error);
                return of(null);
            }),
            switchMap((res: IRecColor) => {
                if (!res) {
                    return of(null as IRecUpdate);
                }
                this._cash.saveToCash(res, this.settings);
                return of({
                    recColor: res,
                    clear: clear,
                    colorSave: this.settings.colorSave,
                } as IRecUpdate);
            }),
            catchError((error: Error) => {
                this._loading(false);
                console.error(error);
                return of(null as IRecUpdate);
            }),
            finalize(() => {
                this.onGameLoad.emit(true);
                this._loading(false);
            })
        );

        this.updatePoints.next(contentTask);
    }

    private _loading(loading: boolean): void {
        this.onGameLoading.emit(loading);
    }
}