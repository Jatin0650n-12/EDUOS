import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForecastResultComponent } from './forecast-result/forecast-result.component';
import { RecommendResultComponent } from './recommend-result/recommend-result.component';
import { GapResultComponent } from './gap-result/gap-result.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultComponent } from './result/result.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { CopilotComponent } from './copilot/copilot.component';
import { ViewBestResourcesComponent } from './view-best-resources/view-best-resources.component';

const routes: Routes = [
  {path : '' , component : HomeComponent},
  {path : 'home' , component : HomeComponent},
  {path : 'login' , component : LoginComponent},
  {path : 'signup' , component : SignupComponent},
  {path : 'upload' , component : UploadComponent},
  {path : 'dashboard' , component : DashboardComponent},
  { path: 'forecast-result', component: ForecastResultComponent },
  { path: 'recommend-result', component: RecommendResultComponent },
  
  { path: 'gap-result', component: GapResultComponent },
  {path:'roles',component:RoleSelectionComponent},
 {path:'quiz',component:QuizComponent},

 {path:'result',component:ResultComponent},
 {
  path:'roadmap',
  component:RoadmapComponent
},
 {
  path:'copilot',
  component:CopilotComponent
},
{
  path:'view-best',
  component:ViewBestResourcesComponent
},
  {path : '**' , component : ErrorComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
