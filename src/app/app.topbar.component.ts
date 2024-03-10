import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import {Router} from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];
    search='';
    constructor(public appMain: AppMainComponent, private r: Router) { }
    ngOnInit(): void {

    }

    logout() {
        // Remove the 'userId' from localStorage
        localStorage.removeItem('userId');

        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Navigate to the login page
        this.r.navigate(['/pages/login']);
    }
}
