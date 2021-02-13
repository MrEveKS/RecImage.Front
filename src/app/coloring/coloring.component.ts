import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
// interfaces
import { IRecUpdate } from './models/rec-update.interface';
import { IRecColor } from './models/rec-color.interface';
import { IColoringSettings } from './models/coloring-settings.interface';
// services
import { ImageConverterService } from './services/image-converter.service';
import { InMemoryCashService } from './services/in-memory-cash.service';
import { ColoringHelperService } from './services/coloring-helper.service';
import { AppTitleService } from 'src/services/app-title.service';

@Component({
    selector: 'coloring',
    styleUrls: ['./coloring.component.scss'],
    templateUrl: './coloring.component.html',
})
export class ColoringComponent implements OnInit, OnDestroy {

    private _coloringSettings!: IColoringSettings;
    private readonly _queryObservable: Observable<number | null>;

    private _destroy = new ReplaySubject<number>(1);

    public constructor(
        titleService: AppTitleService,
        route: ActivatedRoute,
        private _coloringHelper: ColoringHelperService,
        private _http: ImageConverterService,
        private _cash: InMemoryCashService) {
        titleService.setTitle('раскраска');
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
        this._coloringSettings = this._coloringHelper.coloringSettings;
        this._coloringHelper.onSettingsChange
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this._settingsChange());
        this._coloringHelper.onFilesSelect
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this._filesSelect());
        this._queryObservable
            .pipe(takeUntil(this._destroy))
            .subscribe((id: number | null) => {
                this._eventInit(id);
            });
    }

    public ngOnDestroy(): void {
        this._destroy.next(null);
        this._destroy.complete();
    }

    public imageSelect(id: number): void {
        this._loadById(id);
    }

    /**
     * init coloring event
     * @param id image id
     */
    private _eventInit(id: number | null): void {
        if (id) {
            this._loadById(id);
        } else {
            this._coloringSettings.settings.fileName = null;
            this._coloringSettings.settings.imageId = null;
            this._coloringHelper.onFilesSelectFromNavigate.emit();
        }
    }

    private _settingsChange(): void {
        if (this._coloringSettings.settings.fileName) {
            this._filesSelect();
        } else if (this._coloringSettings.settings.imageId) {
            this._loadById(this._coloringSettings.settings.imageId);
        }
    }

    private _filesSelect(): void {
        this._fileLoad(this._coloringSettings.imageFiles);
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
            takeUntil(this._destroy),
        ).subscribe((res: IRecColor) => {
            if (!res) {
                this._loading(false);
                return of(null as IRecUpdate);
            }
            this._cash.saveToCash(res, this._coloringSettings.settings);
            this._coloringHelper.onUpdateCanvas
                .emit({
                    recColor: res,
                    clear: clear,
                    colorSave: this._coloringSettings.settings.colorSave,
                });
        });

    }

    private _loading(loading: boolean): void {
        this._coloringSettings.loading = loading;
    }

}