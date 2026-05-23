import { Component, OnInit } from '@angular/core';
import { SkillService } from '../shared/skill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forecast-result',
  templateUrl: './forecast-result.component.html',
  styleUrls: ['./forecast-result.component.css']
})
export class ForecastResultComponent implements OnInit {

  data: any;

  constructor(private skillService: SkillService, private router: Router) {}

  ngOnInit(): void {
    this.data = this.skillService.getForecastResult();

    if (!this.data) {
      this.router.navigate(['/']);
    }
  }

  backToDashboard() {
    this.router.navigate(['/']);
  }
}
