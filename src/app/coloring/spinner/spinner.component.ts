import { Component, OnInit } from "@angular/core";

import { IColoringSettings } from "../models/coloring-settings.interface";

import { ColoringHelperService } from "../services/coloring-helper.service";

@Component({
    selector: 'spinner',
    styleUrls: ['./spinner.component.scss'],
    templateUrl: './spinner.component.html',
})
export class SpinnerComponent implements OnInit {

    public coloringSettings!: IColoringSettings;

    public constructor(private _coloringHelper: ColoringHelperService) {
    }

    public ngOnInit(): void {
        this.coloringSettings = this._coloringHelper.coloringSettings;
    }

}