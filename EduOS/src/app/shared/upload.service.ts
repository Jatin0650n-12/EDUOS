import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private api = 'https://backend-eduos.onrender.com/api/files';
  constructor(private http: HttpClient) {}



  uploadFile(file: File): Observable<HttpEvent<any>> {
    const fd = new FormData();
    fd.append('file', file);
    const req = new HttpRequest('POST', `${this.api}/upload`, fd, {
      reportProgress: true
    });
    return this.http.request(req);
  }


  fetchFiles(): Observable<any> {
    return this.http.get(`${this.api}/getfiles`);
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.api}/download/${id}`, {
      responseType: 'blob'
    });
  }


  extractSkills(fileId: string): Observable<any> {
    return this.http.get(`https://backend-eduos.onrender.com/api/extract/${fileId}`); 
  }

}
