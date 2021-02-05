import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
// interfaces
import { IRecUpdate } from '../game/game.component';
import { ICashSettings } from './models/cash-settings.interface';
import { IRecColor } from './models/rec-color.interface';
import { IColoringSettings } from './models/coloring-settings.interface';
// services
import { ImageConverterService } from './services/image-converter.service';
import { InMemoryCashService } from './services/in-memory-cash.service';

import { ColoringBoardComponent } from './coloring-board/coloring-board.component';
import { ColoringHelperService } from './services/coloring-helper.service';

@Component({
    selector: 'coloring',
    styleUrls: ['./coloring.component.scss'],
    templateUrl: './coloring.component.html',
})
export class ColoringComponent implements OnInit {

    @Output()
    public onGameLoad = new EventEmitter<boolean>();
    @Output()
    public onGameLoading = new EventEmitter<boolean>();

    private _coloringSettings!: IColoringSettings;
    private readonly _queryObservable: Observable<number | null>;

    @ViewChild(ColoringBoardComponent)
    private _board: ColoringBoardComponent;

    public constructor(route: ActivatedRoute,
        public coloringHelper: ColoringHelperService,
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
        this._coloringSettings = this.coloringHelper.coloringSettings;
        this._queryObservable.subscribe((id: number | null) => {
            this._eventInit(id);
        });
    }

    public filesSelect(files: FileList): void {
        this._coloringSettings.imageFiles = files;
        this._fileLoad(files);
    }

    public imageSelect(id: number): void {
        this._loadById(id);
    }

    public settingsChange(settings: ICashSettings): void {
        this.settingsSet(settings);

        if (this._coloringSettings.settings.fileName) {
            this.filesSelect(this._coloringSettings.imageFiles);
        } else {
            this._loadById(this._coloringSettings.settings.imageId);
        }
    }

    public settingsSet(settings: ICashSettings): void {
        this._coloringSettings.settings = { ...this._coloringSettings.settings, ...settings };
    }

    /**
     * init coloring event
     * @param id image id
     */
    private _eventInit(id: number | null): void {
        if (id) {
            this._loadById(id);
        } else {
            //
        }
    }

    private _loadById(id: number) {
        const clear = this._coloringSettings.settings.imageId !== id;
        this._coloringSettings.settings = { ...this._coloringSettings.settings, fileName: null, imageId: id };
        this._load(clear);
    }

    private _fileLoad(files: FileList): void {
        const fileToUpload = files.item(0) as File;
        const clear = this._coloringSettings.settings.fileName !== fileToUpload.name;
        this._coloringSettings.settings = { ...this._coloringSettings.settings, fileName: fileToUpload.name, imageId: null };
        this._load(clear, fileToUpload);
    }

    private _load(clear: boolean, fileToUpload?: File): void {
        this._loading(true);
        const fromCash = this._cash.loadFromCash(this._coloringSettings.settings);

        (fromCash
            ? of(fromCash)
            : fileToUpload
                ? this._http.convertToPoints<IRecColor>(fileToUpload, this._coloringSettings.settings)
                : this._http.convertToPointsById<IRecColor>(this._coloringSettings.settings)
        ).pipe(
            catchError((error: Error) => {
                this._loading(false);
                console.error(error);
                return of(null);
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
        ).subscribe((res: IRecColor) => {
            if (!res) {
                return of(null as IRecUpdate);
            }
            this._cash.saveToCash(res, this._coloringSettings.settings);
            this._board.updateCanvas({
                recColor: res,
                clear: clear,
                colorSave: this._coloringSettings.settings.colorSave,
            } as IRecUpdate);
        });

    }

    private _loading(loading: boolean): void {
        this.onGameLoading.emit(loading);
    }

}