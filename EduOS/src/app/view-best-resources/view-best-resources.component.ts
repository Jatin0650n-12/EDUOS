import { Component } from '@angular/core';
import { RecommendationService } from './recommendation.service';

@Component({
  selector: 'app-view-best-resources',
  templateUrl: './view-best-resources.component.html',
  styleUrls: ['./view-best-resources.component.css']
})
export class ViewBestResourcesComponent {
  recommendedResources: string[] = [];
  loading = false;
  errorMessage = '';

  jobRoles = [
  'Data Scientist',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'Cloud Engineer'
];
  selectedJobRole = this.jobRoles[0];

  constructor(private recommendationService: RecommendationService) {}

  fetchRecommendations() {
    this.loading = true;
    this.errorMessage = '';
    this.recommendedResources = [];

    const studentData = {
      studentId: 'S8',
      jobRole: this.selectedJobRole,
      quizScore: 72,
      responseTime: 160,
      resourcesUsed: ['R1','R2']
    };

    this.recommendationService.getRecommendedResources(studentData).subscribe({
      next: (res) => {
        this.recommendedResources = res.recommendedResources || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch recommendations', err);
        this.errorMessage = 'Failed to fetch recommended resources.';
        this.loading = false;
      }
    });
  }
}