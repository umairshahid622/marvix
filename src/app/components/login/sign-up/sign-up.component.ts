import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AppConfig } from '../../../api/appconfig';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../service/app.config.service';
import { Router } from '@angular/router';
import {
    HttpClient,
} from '@angular/common/http';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    constructor(
        public configService: ConfigService,
        private r: Router,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.showPassword = false;
        this.showConfirmPassword = false;

        this.registerForm = this.formBuilder.group({
            companyId: ['', Validators.required],
            comapanyName: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            name: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: [
                '',
                [Validators.required, Validators.minLength(8)],
            ],
            cpvCodes: [[], Validators.required],
            locations: [[], Validators.required],
            keywords: [[], Validators.required],
            competitors: [[], Validators.required],
            tenderMinValue: [null, Validators.required],
            tenderMaxValue: [null, Validators.required],
            imageUrl: ['ImageURL'],
        });
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }
    //======== chips ========
    separatorExp: RegExp = /,| /;
    //================
    valCheck: string[] = ['remember'];
    config: AppConfig;
    subscription: Subscription;

    showPassword: boolean;
    showConfirmPassword: boolean;

    registerForm: FormGroup = new FormGroup({
        companyId: new FormControl(''),
        comapanyName: new FormControl(''),
        email: new FormControl(''),
        name: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        cpvCodes: new FormControl(''),
        locations: new FormControl(''),
        keywords: new FormControl(''),
        competitors: new FormControl(''),
        imageUrl: new FormControl('ImageURL'),
        tenderMinValue: new FormControl(),
        tenderMaxValue: new FormControl(),
    });
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }
    toggleShowConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    getConfirmPasswordType() {
        if (this.showConfirmPassword) {
            return 'text';
        }
        return 'password';
    }

    getPasswordType() {
        if (this.showPassword) {
            return 'text';
        }
        return 'password';
    }

    login() {
        localStorage.setItem('user', 'available');
        this.r.navigate(['/']);
    }

    signUp() {
        if (this.registerForm.invalid || !this.passwordMatched()) {
            console.log("Invalid Form");
            return;
        }

        const user = {
            company_id: this.registerForm.value.companyId,
            company_name: this.registerForm.value.comapanyName,
            keywords: this.registerForm.value.keywords,
            recommended_tender_minimum_value: 10,
            tender_minimum_value: this.registerForm.value.tenderMinValue,
            tender_maximum_value: this.registerForm.value.tenderMaxValue,
            cpv_codes: this.registerForm.value.cpvCodes,
            location: this.registerForm.value.locations,
            competitors: this.registerForm.value.competitors,
            name: this.registerForm.value.name,
            email: this.registerForm.value.email,
            photo: "string",
            role: "string",
            created_at: "2024-03-13T20:55:18.195Z",
            updated_at: "2024-03-13T20:55:18.195Z",
            password: this.registerForm.value.password,
            passwordConfirm: this.registerForm.value.confirmPassword,
            verified: false
        };
        console.log(user);

        this.http
            .post(
                'http://45.85.250.231:8000/api/auth/register',
                user
            )
            .subscribe((response) => {
                console.log("Response", response);
                this.r.navigate['/pages/login']
            }, (err) => {
                console.log(err);

            });
    }
    companyIdBlur(event: any) {
        console.log(event);
    }

    passwordMatched() {
        const password = this.registerForm.get('password').value;
        const confirmPassword = this.registerForm.get('confirmPassword').value;

        if (password !== confirmPassword) {
            return false;
        }
        return true;
    }
    passwordValidator() {
        const password = this.registerForm.get('password').value;
        if (password.length < 8) {
            return false;
        }
        return true;
    }


    goToLoginPage() {
        this.r.navigate(['/pages/login'])
    }
}
