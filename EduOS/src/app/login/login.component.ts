import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../shared/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  serverError = '';
  showPassword = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private auth: AuthServiceService, private router: Router) {}

  get f() { return this.loginForm.controls; }

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.serverError = '';
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Login successfull');
        // handle token/storage as per your auth flow
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.serverError = err?.error?.message || 'Login failed';
      }
    });
  }
}
