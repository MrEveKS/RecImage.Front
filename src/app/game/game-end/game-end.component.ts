import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { ShareImageService } from "../services/share-image.service";

import { IGameFinish } from "../models/game-finish.interface";
import { DownloadImageService } from "../services/download-image.service";

@Component({
    selector: 'game-end',
    styleUrls: ['./game-end.component.scss'],
    templateUrl: './game-end.component.html',
})
export class GameEndComponent {

    public gameFinished!: boolean;
    public downloadUrl!: Observable<string>;
    public vkLink!: string;

    public constructor(private _share: ShareImageService,
        private _download: DownloadImageService) {
    }

    public handleFinish(value: IGameFinish): void {
        this.downloadUrl = this._download.canvasToUrl(value.canvas);
        this.vkLink = this._share.vkontakte();

        this.gameFinished = true;
    }

    public handleContinue(): void {
        this.gameFinished = false;
    }

}