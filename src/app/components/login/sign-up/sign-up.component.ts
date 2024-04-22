import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { AuthserviceService } from 'src/app/service/authservice.service';
import { Chips } from 'primeng/chips';


interface City {
    name: string,
    code: string
}

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    providers: [MessageService]
})
export class SignUpComponent implements OnInit, AfterViewInit {

    constructor(
        public configService: ConfigService,
        private r: Router,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private messageService: MessageService,
        private authService: AuthserviceService
    ) {
    }
    @ViewChild('chips', { static: true }) chips: Chips;
    ngAfterViewInit(): void {
        (this.chips.inputViewChild.nativeElement as HTMLInputElement).type = 'number'
    }


    registerForm: FormGroup = new FormGroup({
        companyId: new FormControl(''),
        comapanyName: new FormControl(''),
        emailAddress: new FormControl(''),
        name: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        cpvCodes: new FormControl([]),
        locations: new FormControl([]),
        keywords: new FormControl([]),
        competitors: new FormControl([]),
        imageUrl: new FormControl('ImageURL'),
        tenderMinValue: new FormControl(),
        tenderMaxValue: new FormControl(),
    });

    locs: string[] = ["Konsortia Group", "Manchester Group", "Preston Group", "Liverpool Group"];
    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.r.navigate(['/dashboard']);
        }


        this.showPassword = false;
        this.showConfirmPassword = false;


        this.registerForm = this.formBuilder.group({
            companyId: ['', Validators.required],
            comapanyName: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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
    // registerForm: FormGroup


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

    emailValidator() {
        const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email: string = this.registerForm.get('emailAddress').value
        if (regex.test(email.toLocaleLowerCase().trim())) {
            return true
        }
        return false;
    }

    goToLoginPage() {
        this.r.navigate(['/pages/login'])
    }

    tenderValueValidator(): boolean {
        const minValue: number = this.registerForm.get('tenderMinValue').value;
        const maxValue: number = this.registerForm.get('tenderMaxValue').value;

        if (maxValue <= minValue) {
            return false;
        }
        return true;
    }

    signUp() {
        this.emailValidator();
        if (this.registerForm.invalid || !this.passwordMatched() || !this.tenderValueValidator() || !this.emailValidator()) {
            const err: string = '';
            if (!this.passwordMatched()) {
                console.log("Password Does not match");
            }

            if (!this.tenderValueValidator()) {
                console.log("tender value is not valid");

            }

            if (!this.emailValidator()) {
                console.log("Email not valid");

            }
            console.log("Invalid Form", this.registerForm.status);
            return;
        }

        const payLoad = {
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
            email: this.registerForm.value.emailAddress,
            password: this.registerForm.value.password,
            passwordConfirm: this.registerForm.value.confirmPassword,
        };
        console.log(payLoad);

        // this.http
        //     .post(
        //         'http://45.85.250.231:8000/api/auth/register',
        //         payLoad
        //     )
        //     .subscribe((response) => {
        //         console.log("Response", response);
        //         this.messageService.add({ key: 'tc', severity: 'success', summary: 'success', detail: 'Account created successfully' });
        //         this.r.navigate(['/pages/login'])
        //     }, (err) => {
        //         console.log(err);

        //     });
    }
    companyIdBlur(event: any) {
        console.log(event);
    }

    removeClass(element: HTMLInputElement, status: string) {
        if (element.classList.contains('border-danger') && status === 'VALID') {
            element.classList.remove('border-danger')
        }
    };



    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
