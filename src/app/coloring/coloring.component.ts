import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
// interfaces
import { IRecUpdate } from '../game/game.component';
import { ICashSettings } from './models/cash-settings.interface';
import { IGameSettings } from './models/game-settings.interface';
import { IRecColor } from './models/rec-color.interface';
// services
import { ImageConverterService } from './services/image-converter.service';
import { InMemoryCashService } from './services/in-memory-cash.service';

@Component({
    selector: 'coloring',
    styleUrls: ['./coloring.component.scss'],
    templateUrl: './coloring.component.html',
})
export class ColoringComponent implements OnInit, OnDestroy {

    @Output()
    public onGameLoad = new EventEmitter<boolean>();
    @Output()
    public onGameLoading = new EventEmitter<boolean>();
    @Output()
    public onBackClick = new EventEmitter();

    public settings!: ICashSettings;
    public imageFiles!: FileList;

    public updatePoints: Subject<Observable<IRecUpdate>> = new Subject<Observable<IRecUpdate>>();

    private readonly _queryObservable: Observable<number | null>;

    public constructor(route: ActivatedRoute,
        private _http: ImageConverterService,
        private _cash: InMemoryCashService) {
        this._queryObservable = route.params.pipe(
            map((params: Params) => {
                const param = params['id'];
                return Number.isNaN(param)
                    ? null
                    : Number(param);
            })
        );
    }

    public ngOnInit(): void {
        this._queryObservable.subscribe((id: number | null) => {
            this._eventInit(id);
        });
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

    private _eventInit(id: number | null): void {
        if (!id) {
            //
        } else {
            this._loadById(id);
        }
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