import { Injectable } from '@angular/core';

// interfaces
import { IRecColor } from 'src/app/game/models/rec-color.interface';
import { ICashSettings } from '../models/cash-settings.interface';

@Injectable({
    providedIn: 'root'
})
export class InMemoryCashService {

    /**
     * fileName|imageId colorStep size colored IRecColor
     */
    private _cash: { [key: string]: { [key: number]: { [key: number]: { [key: string]: IRecColor } } } };

    constructor() {
        this._setEmptyCash();
    }

    public clear(): void {
        this._setEmptyCash();
    }

    public loadFromCash(settings: ICashSettings): IRecColor {
        let nameKey = settings.fileName;
        if (!nameKey) {
            const imageId = settings.imageId;
            if (imageId) {
                nameKey = String(settings.imageId);
            }
        }
        if (!this._cash[nameKey]
            || !this._cash[nameKey][settings.colorStep]
            || !this._cash[nameKey][settings.colorStep][settings.size]
            || !this._cash[nameKey][settings.colorStep][settings.size][settings.colored.toString()]) return null;
        return this._cash[nameKey][settings.colorStep][settings.size][settings.colored.toString()] || null;
    }

    public saveToCash(res: IRecColor, settings: ICashSettings): void {
        const nameKey = settings.fileName || settings.imageId.toString();
        const boolKey = settings.colored.toString();
        if (!this._cash[nameKey]) {
            this._cash[nameKey] = {};
            this._cash[nameKey][settings.colorStep] = {};
            this._cash[nameKey][settings.colorStep][settings.size] = {};
        } else if (!this._cash[nameKey][settings.colorStep]) {
            this._cash[nameKey][settings.colorStep] = {};
            this._cash[nameKey][settings.colorStep][settings.size] = {};
        } else if (!this._cash[nameKey][settings.colorStep][settings.size]) {
            this._cash[nameKey][settings.colorStep][settings.size] = {};
        }

        this._cash[nameKey][settings.colorStep][settings.size][boolKey] = res;
    }

    private _setEmptyCash(): void {
        this._cash = {};
    }

}