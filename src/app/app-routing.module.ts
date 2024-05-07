import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecomendationsComponent } from "./components/recomendations/recomendations.component";
import { SignUpComponent } from './components/login/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { OpenTenderComponent } from './components/open-tender/open-tender.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guards/auth.guard';



// const routes: Routes = [
//     {
//         path: '', component: AppMainComponent,
//         children: [
//             { path: '', component: DashboardComponent },
//             { path: 'Dashboard', component: DashboardComponent },
//             { path: 'Recomendations/AIModel', component: RecomendationsComponent },
//             { path: 'user-profile', component: UserProfileComponent },
//             { path: 'specific-keyword', component: SpecificKeywordsComponent },
//         ],
//     },
//     { path: 'pages/login', component: LoginComponent },
//     { path: 'pages/signUp', component: SignUpComponent },

// ]

const routes: Routes = [

    { path: 'pages/login', component: LoginComponent },
    { path: 'pages/signUp', component: SignUpComponent },
    { path: '', redirectTo: 'pages/login', pathMatch: 'full' },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/components.module').then((route) => route.ComponentsModule)
    },
    { path: '**', component: NotfoundComponent }

]


@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
