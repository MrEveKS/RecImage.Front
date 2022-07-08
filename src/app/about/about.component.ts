import { Component } from '@angular/core';
import { AppTitleService } from 'src/services/app-title.service';

@Component({
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  constructor(titleService: AppTitleService) {
    titleService.setTitle('о нас');
  }
}
