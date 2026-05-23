import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  result:any;

constructor(private http: HttpClient, private router: Router) {}

ngOnInit(){

 this.result = JSON.parse(localStorage.getItem("quizResult") || "{}");

}

  generateRoadmap() {

  const payload = {
    role: this.result.role,
    accuracy: this.result.accuracy,
    avgResponseTime: this.result.avgResponseTime,
    strongSkills: this.result.strongSkills,
    mediumSkills: this.result.mediumSkills,
    weakSkills: this.result.weakSkills
  };

  this.http.post("https://backend-eduos.onrender.com/roadmap/generate", payload)
  .subscribe((res:any)=>{

    localStorage.setItem("roadmap", JSON.stringify(res));

    this.router.navigate(['/roadmap']);

  });

}

}
