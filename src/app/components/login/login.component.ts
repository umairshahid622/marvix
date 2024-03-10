import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
interface UserData {
    status: string;
    user: {
        name: string;
        email: string;
        photo: string;
        role: string;
        created_at: string;
        updated_at: string;
        id: string;
    };
}
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService],
    styles: [
        `
            :host ::ng-deep .p-password input {
                width: 100%;
                padding: 1rem;
            }

            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            :host ::ng-deep {
                .p-button-label {
                    display: contents;
                }
            }
            .loader {
                border: 4px solid seashell;
                border-radius: 50%;
                border-top: 4px solid slateblue;
                border-bottom: 4px solid slateblue;
                width: 26px;
                height: 26px;
                -webkit-animation: spin 2s linear infinite;
                animation: spin 2s linear infinite;
            }

            @-webkit-keyframes spin {
                0% {
                    -webkit-transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                }
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .loginButton {
                margin: 0px;
                display: flex;
                width: 100%;
                justify-content: center;
                font-weight: bold;
                p {
                    margin: 0px;
                    font-weight: bold;
                }
            }
        `,
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    valCheck: string[] = ['remember'];
    loading = false;
    password: string;
    email: string;
    config: AppConfig;
    subscription: Subscription;
    response: any;
    error: string;

    httpErrorResponse: HttpErrorResponse;
    private apiUrl = 'http://localhost:5000/api/users/me';

    constructor(
        public configService: ConfigService,
        private router: Router,
        private http: HttpClient,
        private messageService: MessageService,
        private appService: AppService
    ) {}

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onReject() {
        this.messageService.clear('c');
    }

    login() {
        this.loading = true;
        this.http
            .post<any>('http://localhost:5000/api/auth/login', {
                email: this.email,
                password: this.password,
            })
            .subscribe(
                (response) => {
                    this.response = response;

                    if (response.status === 'success' && response.access_token) {
                        // Store the access token in local storage
                        localStorage.setItem('access_token', response.access_token);

                        // Make the API call to get user data
                        this.getUserId();

                        this.router.navigate(['/']);
                    } else {
                        console.error('Invalid response format. Missing status or access_token.');
                        this.loading = false;
                    }
                },
                (err) => {
                    this.loading = false;
                    console.error('Login error:', err);

                    switch (err.status) {
                        case 500:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Info',
                                detail: 'Connection Refused',
                            });
                            break;
                        case 400:
                            if (err.error.error.errors.name && err.error.password) {
                                this.error = 'username and password are required';
                            } else if (err.error.username) {
                                this.error = 'username is required';
                            } else if (err.error.password) {
                                this.error = 'password is required';
                            } else {
                                this.error = err.error.non_field_errors;
                            }
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Info',
                                detail: this.error,
                            });
                            break;
                        default:
                            break;
                    }
                }
            );
    }

    getUserId() {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.error('Access token not found in local storage');
            return;
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        this.http.get<UserData>(this.apiUrl, { headers: headers, withCredentials: true })
            .subscribe(
                (datauser) => {
                    // Assuming the response structure includes 'user' and 'id'
                    const userId = datauser?.user?.id;

                    if (userId) {
                        localStorage.setItem('userId', userId);
                        console.log('User ID saved to localStorage:', userId);
                    } else {
                        console.error('Invalid user data structure in the response.');
                    }
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                }
            );
    }
}
