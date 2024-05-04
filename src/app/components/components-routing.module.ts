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
      { path: '', redirectTo:'awardedTenders', pathMatch:'full' },
      { path: 'awardedTenders', component: DashboardComponent },
      { path: 'recomendations/AIModel', component: RecomendationsComponent },
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
