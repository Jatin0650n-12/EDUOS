import { Component, OnInit } from '@angular/core';
import { SkillService } from '../shared/skill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gap-result',
  templateUrl: './gap-result.component.html',
  styleUrls: ['./gap-result.component.css']
})
export class GapResultComponent implements OnInit {

  data: any;

  constructor(private skillService: SkillService, private router: Router) {}

  ngOnInit(): void {
    this.data = this.skillService.getGapResult();

    if (!this.data) {
      this.router.navigate(['/']);
    }
  }

  backToDashboard() {
    this.router.navigate(['/']);
  }
}
