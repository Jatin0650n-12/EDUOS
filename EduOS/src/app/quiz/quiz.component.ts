import { Component } from '@angular/core';
import { QuizService } from './quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  questions:any[] = [];
currentIndex = 0;

  

responses:any[] = [];

startTime:any;

constructor(private quizService:QuizService,
            private router:Router){}

ngOnInit(){

 this.questions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");

 this.startTime = Date.now();

}



answerQuestion(option:any){

 let endTime = Date.now();

 let responseTime = (endTime - this.startTime) / 1000;

 this.responses.push({
   questionId: this.questions[this.currentIndex]._id,
   selected: option,
   responseTime: responseTime
 });

 this.currentIndex++;

 this.startTime = Date.now();

 if(this.currentIndex == this.questions.length){
   this.submitQuiz();
 }

}


submitQuiz(){

 let payload = {

   userId: "123",

   role: "Data Scientist",

   responses: this.responses

 }

 this.quizService.submitQuiz(payload)
 .subscribe((res:any)=>{

   localStorage.setItem("quizResult", JSON.stringify(res));

   this.router.navigate(['/result']);

 });

}


}
