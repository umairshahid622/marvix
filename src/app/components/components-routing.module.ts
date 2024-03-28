import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppMainComponent } from '../app.main.component';
import { RecomendationsComponent } from './recomendations/recomendations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SpecificKeywordsComponent } from './specific-keywords/specific-keywords.component';

const routes: Routes = [
  {
    path: '', component: AppMainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Recomendations/AIModel', component: RecomendationsComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'specific-keyword', component: SpecificKeywordsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
