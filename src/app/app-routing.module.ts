import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {RecomendationsComponent} from "./components/recomendations/recomendations.component";
import { SignUpComponent } from './components/login/sign-up/sign-up.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent },
                    { path: 'Dashboard', component: DashboardComponent },
                    { path: 'Recomendations/AIModel', component: RecomendationsComponent },


                ],
            },
            { path: 'pages/login', component: LoginComponent },
            { path: 'pages/signUp', component: SignUpComponent },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
