import { Component, OnInit } from '@angular/core';
import { SkillService } from '../shared/skill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommend-result',
  templateUrl: './recommend-result.component.html',
  styleUrls: ['./recommend-result.component.css']
})
export class RecommendResultComponent implements OnInit {

  data: any;

  predictedRole: string = '';   // ✅ ADD THIS LINE


  constructor(private skillService: SkillService, private router: Router) {}

  ngOnInit(): void {
    this.data = this.skillService.getRecommendedSkills();


    
  this.predictedRole = this.skillService.getPredictedRole();

  if (!this.predictedRole) {
    const savedRole = localStorage.getItem('predictedRole');
    if (savedRole) {
      this.predictedRole = savedRole;
    }
  }

    if (!this.data) {
      this.router.navigate(['/']);
    }
  }

  backToDashboard() {
    this.router.navigate(['/']);
  }
}
