import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private ML_LAYER_URL = 'https://eduos-ml.onrender.com/recommend'; // ML-layer URL

  constructor(private http: HttpClient) {}

  getRecommendedResources(studentData: any): Observable<any> {
    return this.http.post<any>(this.ML_LAYER_URL, studentData);
  }
}