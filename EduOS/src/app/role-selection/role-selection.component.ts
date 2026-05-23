import { Component } from '@angular/core';
import { QuizService } from '../quiz/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css'
})
export class RoleSelectionComponent {
  roles = [
 "Data Scientist",
 "Frontend Developer",
 "Backend Developer",
 "Full Stack Developer",
 "Machine Learning Engineer",
 "Data Analyst",
 "DevOps Engineer",
 "Cloud Engineer"
];

selectedRole:any;

constructor(private quizService:QuizService,
            private router:Router){}

generateQuiz(){

  this.quizService.generateQuiz(this.selectedRole)
  .subscribe((res:any)=>{

    localStorage.setItem("quizQuestions", JSON.stringify(res));

    this.router.navigate(['/quiz']);

  });

}


}
