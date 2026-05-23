import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  baseUrl = "https://backend-eduos.onrender.com";

  constructor(private http: HttpClient) {}

  generateQuiz(role:any){
    return this.http.get(`${this.baseUrl}/quiz/${role}`);
  }

  submitQuiz(data:any){
    return this.http.post(`${this.baseUrl}/quiz/submit`, data);
  }

}