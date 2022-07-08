import { Component, OnInit } from '@angular/core';
import { IColoringSettings } from '../models/coloring-settings.interface';
import { ColoringHelperService } from '../services/coloring-helper.service';

@Component({
  selector: 'app-progress-bar',
  styleUrls: ['./progress-bar.component.scss'],
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnInit {
  public coloringSettings!: IColoringSettings;

  public constructor(private _coloringHelper: ColoringHelperService) {}

  public ngOnInit(): void {
    this.coloringSettings = this._coloringHelper.coloringSettings;
  }
}
