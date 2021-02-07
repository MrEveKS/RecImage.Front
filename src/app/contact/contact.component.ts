import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AppTitleService } from 'src/services/app-title.service';
// interfaces
import { IContactMessage } from './models/contact-message.interface';

import { ContactService } from './services/contact.service';

@Component({
    selector: 'contact',
    styleUrls: ['./contact.component.scss'],
    templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit, OnDestroy {

    public contactForm: FormGroup;

    private _destroy = new ReplaySubject<number>(1);

    public constructor(
        titleService: AppTitleService,
        private _contactService: ContactService
    ) {
        titleService.setTitle('контакты');
    }

    public ngOnInit(): void {
        this._itinForm();
    }

    public ngOnDestroy(): void {
        this._destroy.next(null);
        this._destroy.complete();
    }

    public submit(): void {
        if (!this.contactForm.valid) {
            Object.keys(this.contactForm.controls)
                .forEach((controlName) => this.contactForm.controls[controlName].markAsTouched());
            return;
        }

        this.contactForm.disable();
        const message = this.contactForm.value as IContactMessage;
        this._contactService.postMessage(message)
            .pipe(
                catchError((error: Error) => {
                    this.contactForm.enable();
                    console.error(error);
                    return null;
                }),
                takeUntil(this._destroy)
            )
            .subscribe(() => {
                this.contactForm.enable();
                this.contactForm.reset();
            });
    }

    private _itinForm(): void {
        this.contactForm = new FormGroup({
            "userName": new FormControl("", [Validators.required, Validators.maxLength(50)]),
            "userEmail": new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
            "userMessage": new FormControl("", [Validators.required, Validators.maxLength(500)])
        });
    }

}