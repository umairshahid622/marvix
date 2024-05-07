import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppMainComponent } from '../app.main.component';
import { RecomendationsComponent } from './recomendations/recomendations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OpenTendersComponent } from './open-tenders/open-tenders.component';

const routes: Routes = [
  {
    path: '', component: AppMainComponent,
    children: [
      { path: '', redirectTo:'openTenders', pathMatch:'full' },
      { path: 'openTenders', component: OpenTendersComponent },
      { path: 'awardedTenders', component: DashboardComponent },
      { path: 'recomendations/AIModel', component: RecomendationsComponent },
      { path: 'user-profile', component: UserProfileComponent },
      // { path: 'openTenders', component: OpenTenderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
