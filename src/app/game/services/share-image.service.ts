import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const { encodeURIComponent } = window;

@Injectable({
    providedIn: 'root'
})
export class ShareImageService {

    private readonly _siteUrl = environment.siteUrl;

    private readonly _url = {
        vk: 'https://vk.com/share.php',
        image: `${this._siteUrl}assets/social/social-post.png`,
    };

    public vkontakte(): string {
        const url = this._siteUrl;
        const title = encodeURIComponent('Rec Image');
        const description = encodeURIComponent('Раскраска по пикселям');
        const image = this._url.image;

        return `${this._url.vk}?url=${url}&title=${title}&description=${description}&image=${image}&noparse=false`;
    }

}