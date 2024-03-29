import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ImageListService } from 'src/services/image-list.service';

import { IImageListItem } from 'src/app/image-collection/models/image-list-item.interface';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-image-collection',
  styleUrls: ['./image-collection.component.scss'],
  templateUrl: './image-collection.component.html',
})
export class ImageCollectionComponent implements OnInit {
  public url = environment.url;
  public imageList: Observable<IImageListItem[]>;

  public count: number;

  public constructor(private _imageListService: ImageListService) {}

  public ngOnInit(): void {
    this.imageList = this._imageListService.getAll<IImageListItem[]>().pipe(
      map(res => {
        this.count = res.length;
        return res;
      })
    );
  }
}
