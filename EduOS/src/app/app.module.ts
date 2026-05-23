import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { ErrorComponent } from './error/error.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OutputComponent } from './output/output.component';
import { ForecastResultComponent } from './forecast-result/forecast-result.component';
import { RecommendResultComponent } from './recommend-result/recommend-result.component';
import { GapResultComponent } from './gap-result/gap-result.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultComponent } from './result/result.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { CopilotComponent } from './copilot/copilot.component';
import { CommonModule } from '@angular/common';
import { ViewBestResourcesComponent } from './view-best-resources/view-best-resources.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UploadComponent,
    ErrorComponent,
    SignupComponent,
    HeaderComponent,
    DashboardComponent,
    OutputComponent,
    ForecastResultComponent,
    RecommendResultComponent,
    GapResultComponent,
    RoleSelectionComponent,
    QuizComponent,
    ResultComponent,
    RoadmapComponent,
    CopilotComponent,
    ViewBestResourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
