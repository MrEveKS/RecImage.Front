import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// interfaces
import { IColRow } from 'src/app/coloring/models/col-row.interface';
import { IRecColor } from 'src/app/coloring/models/rec-color.interface';
import { IRecUpdate } from '../models/rec-update.interface';

// services
import { ColoringHelperService } from '../services/coloring-helper.service';

@Component({
  selector: 'app-coloring-board',
  styleUrls: ['./coloring-board.component.scss'],
  templateUrl: './coloring-board.component.html',
})
export class ColoringBoardComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  public recColor!: IRecColor;
  public colorPoint: { [key: string]: IColRow[] } = {};

  public get zoom(): number {
    return this._coloringHelper.coloringSettings.zoom;
  }

  @ViewChild('container', { read: ElementRef })
  private _container: ElementRef<HTMLDivElement>;
  @ViewChild('canvasContainer', { read: ElementRef })
  private _canvasContainer: ElementRef<HTMLCanvasElement>;
  private _context: CanvasRenderingContext2D;

  private _totalColors = 0;
  private _currentUpdated: { [key: string]: boolean } = {};
  private _updated: { [key: string]: boolean } = {};
  private _updatePosition: boolean;

  private readonly _defaultView: WindowProxy;
  private readonly _defaultRecSize = 25;

  /**
   * Expectation ViewChild init
   */
  private _afterInitAction: () => void;

  private _destroy = new ReplaySubject<number>(1);

  private _coloringClicked = false;
  private _visitTime: number;

  constructor(
    private _renderer: Renderer2,
    private _coloringHelper: ColoringHelperService,
    @Inject(DOCUMENT) document: Document
  ) {
    this._defaultView = document.defaultView;
    this._coloringHelper.onUpdateCanvas
      .pipe(takeUntil(this._destroy))
      .subscribe((recUpdate: IRecUpdate) => this._updateCanvas(recUpdate));
  }

  private static _getContext(
    canvas: HTMLCanvasElement,
    desynchronized: boolean
  ): CanvasRenderingContext2D {
    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: desynchronized,
    });
    context.imageSmoothingEnabled = false;
    context.globalCompositeOperation = 'source-over';
    return context;
  }

  private static _fillContext(
    context: CanvasRenderingContext2D,
    points: IColRow[],
    size: number
  ) {
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
      const point = points[pointIndex];
      const x = point.col * size;
      const y = point.row * size;

      context.fillStyle = '#fff';
      context.fillRect(x, y, size, size);
      context.fillStyle = '#666';

      context.strokeRect(x + 2, y + 2, size - 4, size - 4);
      context.fillText(
        point.num.toString(),
        x - size / 2 + size,
        y - size / 2 + size
      );
    }
  }

  private static _getCursorPosition(
    canvas: HTMLCanvasElement,
    $event: MouseEvent
  ): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const x = $event.clientX - rect.left;
    const y = $event.clientY - rect.top;
    return { x, y };
  }

  public ngAfterViewChecked(): void {
    if (!this._updatePosition) return;
    this._updatePosition = false;
    this._updateCanvasPosition(this._context.canvas);
  }

  public ngAfterViewInit(): void {
    const canvas = this._canvasContainer.nativeElement;
    this._context = ColoringBoardComponent._getContext(canvas, false);
    canvas.width = 0;
    canvas.height = 0;

    this._afterViewChildInitCall();
    this._visitEventEmmit();
  }

  public ngOnInit(): void {
    this._coloringHelper.onZoomChange
      .pipe(takeUntil(this._destroy))
      .subscribe(() => (this._updatePosition = true));

    fromEvent(this._defaultView, 'resize')
      .pipe(takeUntil(this._destroy))
      .subscribe(this._updateCanvasPosition.bind(this));
  }

  public ngOnDestroy(): void {
    this._destroy.next(null);
    this._destroy.complete();
  }

  /**
   * On point click
   * @param $event click event
   */
  public onClick($event: MouseEvent): void {
    if (!this._coloringClicked) {
      this._coloringClicked = true;
    }

    const recColor = this.recColor;
    const size = this._defaultRecSize;
    const zoomSize = (this._defaultRecSize * this.zoom) / 100;
    const context = this._context;
    const position = ColoringBoardComponent._getCursorPosition(
      this._canvasContainer.nativeElement,
      $event
    );

    const row = Math.floor((position.y - (position.y % zoomSize)) / zoomSize);
    const col = Math.floor((position.x - (position.x % zoomSize)) / zoomSize);
    const num = recColor.cells[row][col];
    const color = recColor.cellsColor[num];
    if (this._updated[color]) return;
    this._updated[color] = true;
    this._currentUpdated[color] = true;

    context.fillStyle = color;
    for (let index = 0; index < this.colorPoint[color].length; index++) {
      const cor = this.colorPoint[color][index];
      context.fillRect(cor.col * size, cor.row * size, size, size);
    }

    this._updateProgress();
  }

  /**
   * Update canvas
   * @param recUpdate clear updated colors
   */
  private _updateCanvas(recUpdate: IRecUpdate): void {
    if (recUpdate.clear) {
      this._updated = {};
    }

    const updateCanvasAction = () => {
      this.recColor = recUpdate.recColor;
      this._totalColors = Object.keys(this.recColor.cellsColor).length;
      this._emptyData(recUpdate.colorSave);
      this._generateColorPoint();

      this._fillCanvas();

      if (!recUpdate.clear && recUpdate.colorSave) {
        this._updateProgress();
      }
    };

    if (!this._container || !this._canvasContainer) {
      this._afterInitAction = updateCanvasAction;
    } else {
      updateCanvasAction();
    }
  }

  private _fillCanvas(): void {
    const canvas = this._renderer.createElement('canvas');
    const context = ColoringBoardComponent._getContext(canvas, true);
    const originCanvas = this._canvasContainer.nativeElement;

    this._resizeCanvas(canvas);
    this._resizeCanvas(originCanvas);

    this._generateCanvas(context);
    this._canvasPositionChange(originCanvas);

    this._context.drawImage(canvas, 0, 0);
  }

  private _emptyData(colorSave: boolean): void {
    this._progress(0);
    this.colorPoint = {};
    this._currentUpdated = {};
    !colorSave && (this._updated = {});
  }

  private _generateColorPoint(): void {
    const recColor = this.recColor;
    this.colorPoint = {};
    const cells = recColor.cells;
    const cellsColor = recColor.cellsColor;
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        const num = cells[row][col];
        const color = cellsColor[num];
        !this.colorPoint[color] && (this.colorPoint[color] = []);
        this.colorPoint[color].push({ col, row, num });
      }
    }
  }

  private _generateCanvas(context: CanvasRenderingContext2D): void {
    const size: number = this._defaultRecSize;
    const updated: { [key: string]: boolean } = this._updated;
    const colorPoint: { [key: string]: IColRow[] } = this.colorPoint;
    const updatedColors = Object.keys(updated).filter(key => updated[key]);
    const colors = Object.keys(colorPoint).filter(
      key => updatedColors.indexOf(key) === -1
    );

    for (
      let index = 0, length = updatedColors.length;
      index < length;
      index += 1
    ) {
      const color = updatedColors[index];
      const points = colorPoint[color];
      if (!points) continue;
      context.fillStyle = color;
      for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        const point = points[pointIndex];
        const x = point.col * size;
        const y = point.row * size;

        context.fillRect(x, y, size, size);
        this._currentUpdated[color] = true;
      }
    }

    const bigNumber = 1000;
    for (let index = 0; index < colors.length; index++) {
      const color = colors[index];
      const points = colorPoint[color];
      const big = points.filter(p => p.num >= bigNumber);
      const small = points.filter(p => p.num < bigNumber);

      context.strokeStyle = '#ccc';

      context.font = '9px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      ColoringBoardComponent._fillContext(context, big, size);

      context.font = '11px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      ColoringBoardComponent._fillContext(context, small, size);
    }

    setTimeout(() => {
      this._updateCanvasPosition(context.canvas);
      this._loading(false);
    });
  }

  private _resizeCanvas(canvas: HTMLCanvasElement): void {
    const points = this.recColor.cells;
    const height = points.length * this._defaultRecSize;
    const width = points[0].length * this._defaultRecSize;
    canvas.height = height;
    canvas.width = width;
  }

  private _updateCanvasPosition(canvas: HTMLCanvasElement): void {
    if (this.zoom === 100) return;
    this._canvasPositionChange(canvas);
  }

  private _canvasPositionChange(canvas: HTMLCanvasElement): void {
    const canvasWidth = (+canvas.width * this.zoom) / 100;
    const canvasHeight = (+canvas.height * this.zoom) / 100;

    const canvasContainer = this._container.nativeElement;
    const canvasContainerWidth = +canvasContainer.clientWidth;
    const canvasContainerHeight = +canvasContainer.clientHeight;
    const styleValues = this._defaultView.getComputedStyle(canvas);
    const marginTop = parseInt(styleValues.getPropertyValue('margin-top'));
    const marginLeft = parseInt(styleValues.getPropertyValue('margin-left'));

    const left =
      canvasWidth < canvasContainerWidth
        ? `${(canvasContainerWidth - canvasWidth) / 2 - marginLeft}px`
        : 'unset';
    const top =
      canvasHeight < canvasContainerHeight
        ? `${(canvasContainerHeight - canvasHeight) / 2 - marginTop}px`
        : 'unset';

    this._renderer.setStyle(canvas, 'left', left);
    this._renderer.setStyle(canvas, 'top', top);
  }

  private _updateProgress(): void {
    this._progress(
      (Object.keys(this._currentUpdated).length / this._totalColors) * 100
    );
  }

  private _progress(progress: number): void {
    this._coloringHelper.coloringSettings.progress = progress;
  }

  private _afterViewChildInitCall(): void {
    if (this._afterInitAction) {
      this._afterInitAction();
      this._afterInitAction = null;
    }
  }

  private _loading(loading: boolean): void {
    this._coloringHelper.coloringSettings.loading = loading;
  }

  private _visitEventEmmit(): void {
    if (this._visitTime) {
      this._defaultView.clearTimeout(this._visitTime);
    }
  }
}
