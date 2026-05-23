import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginModel, RegisterModel } from './registerModel';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private tokenKey = 'auth_token';
  private expiryKey = 'auth_token_expiry';
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();
  private logoutTimer?: any;
  private accessToken: string = "";

  private apiUrl = 'https://backend-eduos.onrender.com/api/auth'; // change to your Flask API base URL

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('auth_token');
    this._isAuthenticated.next(!!token);
  }

  register(data: any): Observable<RegisterModel> {
    return this.http.post<RegisterModel>(`${this.apiUrl}/register`, data);
  }


  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }



  private setSession(res: any) {
    this.accessToken = res.data;
    const expiresIn = res.expiresIn ?? 3600;
    const expiryTs = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.tokenKey, this.accessToken);
    localStorage.setItem(this.expiryKey, String(expiryTs));
    this._isAuthenticated.next(true);
    this.startAutoLogoutTimer(expiresIn);
  }



  autoLogin(): void {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = Number(localStorage.getItem(this.expiryKey) || '0');
    if (!token || Date.now() >= expiry) {
      this.clearSession();
      return;
    }
    this.accessToken = token;
    this._isAuthenticated.next(true);
    const secondsLeft = Math.floor((expiry - Date.now()) / 1000);
    this.startAutoLogoutTimer(secondsLeft);
  }


  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession() {
    this.accessToken = "";
    this._isAuthenticated.next(false);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expiryKey);
    if (this.logoutTimer) { clearTimeout(this.logoutTimer); this.logoutTimer = undefined; }
  }


  private startAutoLogoutTimer(seconds: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    const ms = Math.max(0, seconds * 1000);
    this.logoutTimer = setTimeout(() => {
      this.clearSession();
      this.router.navigate(['/login']);

    }, ms);
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }


}