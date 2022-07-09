import {
  ElementRef,
  HostBinding,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

import { animate, style, transition, trigger } from '@angular/animations';
import { MatToolbarRow } from '@angular/material/toolbar';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-row-smooth]',
  template: `<ng-content></ng-content>`,
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition(
        '* <=> *',
        [
          style({ height: '{{startHeight}}px', opacity: 0 }),
          animate('.5s ease'),
        ],
        { params: { startHeight: 0 } }
      ),
    ]),
  ],
})
export class NavRowSmoothHeightComponent
  extends MatToolbarRow
  implements OnChanges
{
  @Input() public trigger: boolean;

  private _startHeight: number;

  public constructor(private _element: ElementRef) {
    super();
  }

  @HostBinding('@grow') public get grow() {
    return { value: this.trigger, params: { startHeight: this._startHeight } };
  }

  public ngOnChanges(): void {
    this._setStartHeight();
  }

  private _setStartHeight(): void {
    this._startHeight = this._element.nativeElement.clientHeight;
  }
}
