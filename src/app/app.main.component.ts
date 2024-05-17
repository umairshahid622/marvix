import { Component, AfterViewInit, OnDestroy, Renderer2, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppComponent } from './app.component';
import { ConfigService } from './service/app.config.service';
import { AppConfig } from './api/appconfig';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';



interface User {
    status: string
    user: {
        company_id: string
        company_name: string
        competitors: string[]
        cpv_codes: number[]
        created_at: string
        email: string
        id: string
        keywords: string[]
        location: string[]
        name: string
        photo: string
        recommended_tender_minimum_value: number
        role: string
        tender_maximum_value: number
        tender_minimum_value: number
        updated_at: string
    }
}





@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
    animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {

    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public overlayMenuActive: boolean;

    public staticMenuInactive: boolean = false;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;

    public theme: string;

    documentClickListener: () => void;

    menuClick: boolean;

    topMenuButtonClick: boolean;

    configActive: boolean;

    configClick: boolean;

    config: AppConfig;

    subscription: Subscription;

    constructor(public renderer: Renderer2, public app: AppComponent, public configService: ConfigService, private readonly http: HttpClient,) { }
    accessToken: string;
    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
        this.accessToken = localStorage.getItem('access_token')
        this.http.get('http://45.85.250.231:8000/api/users/me', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        }).subscribe((response: User) => {
            
            // console.log("Main Component", response);
            // console.log("CPV CODES LENGTH", response.user.cpv_codes.length);
            // console.log("Keywords LENGTH", response.user.keywords.length);

            this.http.post(`http://45.85.250.231:9000/api/open/run_crawler_from_db_open`, {}, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                },
            }).subscribe((res) => {
                console.log("api/open/run_crawler_from_db_open", res);

            }, (err) => {
                console.log(err);

            })

            // for (let index = 0; index < response.user.cpv_codes.length; index++) {
            //     this.http.get(`http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open`, {
            //         headers: {
            //             'Authorization': `Bearer ${this.accessToken}`,
            //         },
            //         // params: {
            //         //     cpv_code: "45262212",
            //         //     keyword: "Trench sheeting work",
            //         //     skip: 0,
            //         //     limit: 10
            //         // }
            //         params: {
            //             cpv_code: response.user.cpv_codes[index].toString(),
            //             keyword: response.user.keywords[index],
            //             skip: 0,
            //             limit: 10
            //         }
            //     }).subscribe((res) => {
            //         console.log("api/open/get_contracts_keywords_cpv_open", res);
            //     }, (err) => {
            //         console.log("api/open/get_contracts_keywords_cpv_open", err);
            //     })
            // }


        }, (err) => {
            console.log(err);
        })
    }

    ngAfterViewInit() {
        // hides the overlay menu and top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }

                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }
            }
            else {
                if (!this.menuClick && this.isOverlay()) {
                    this.menuInactiveDesktop = true;
                }
                if (!this.menuClick) {
                    this.overlayMenuActive = false;
                }
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            this.configClick = false;
            this.menuClick = false;
            this.topMenuButtonClick = false;
        });
    }

    toggleMenu(event: Event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.app.menuMode === 'overlay') {
                if (this.menuActiveMobile === true) {
                    this.overlayMenuActive = true;
                }

                this.overlayMenuActive = !this.overlayMenuActive;
                this.menuActiveMobile = false;
            }
            else if (this.app.menuMode === 'static') {
                this.staticMenuInactive = !this.staticMenuInactive;
            }
        }
        else {
            this.menuActiveMobile = !this.menuActiveMobile;
            this.topMenuActive = false;
        }

        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;

        if (this.topMenuActive) {
            this.hideTopMenu();
        } else {
            this.topMenuActive = true;
        }

        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 1);
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 992;
    }

    isMobile() {
        return window.innerWidth < 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }


        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
