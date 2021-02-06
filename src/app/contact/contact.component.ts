import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// interfaces
import { IContectMessage } from './contact-message.interface';

@Component({
    selector: 'contact',
    styleUrls: ['./contact.component.scss'],
    templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {

    public contactForm: FormGroup;

    public ngOnInit(): void {
        this._itinForm();
    }

    public submit(): void {
        const message = this.contactForm.value as IContectMessage;
        console.log(message);
    }

    private _itinForm(): void {
        this.contactForm = new FormGroup({
            "userName": new FormControl("", [ Validators.required ]),
            "userEmail": new FormControl("", [ Validators.required, Validators.email ]),
            "userMessage": new FormControl("", [ Validators.required ])
        });
    }

}