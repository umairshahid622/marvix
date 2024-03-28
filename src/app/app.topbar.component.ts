import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from "@angular/router";
import { AuthserviceService } from './service/authservice.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];
    search = '';
    constructor(public appMain: AppMainComponent, private readonly r: Router, private readonly authService: AuthserviceService) { }
    ngOnInit(): void {

    }

    logout() {
        this.authService.logout()
    }
}
