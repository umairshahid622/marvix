import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    searchQuery:any;
    searchHistory = [];
    dynamicMenu = [];
    constructor(public appMain: AppMainComponent) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
            },
            {
                items:[
                    {label: 'Open Tenders',icon: 'pi pi-fw pi-bolt',routerLink: ['/dashboard/openTenders']},
                    {label: 'Awarded Tenders',icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/awardedTenders']},
                    {label: 'AI Recomendations',icon: 'pi pi-fw pi-prime',routerLink: ['/dashboard/recomendations/AIModel']},
                    {label: 'User Profile',icon: 'pi pi-fw pi-user',routerLink: ['/dashboard/user-profile']},
                ]
            },



        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
