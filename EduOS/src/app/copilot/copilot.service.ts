// copilot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CopilotRequest {
  question: string;
}

interface CopilotResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class CopilotService {

  private API_URL = 'https://backend-eduos.onrender.com/copilot/ask';

  constructor(private http: HttpClient) { }

  askQuestion(request: CopilotRequest): Observable<CopilotResponse> {
    return this.http.post<CopilotResponse>(this.API_URL, request);
  }
}