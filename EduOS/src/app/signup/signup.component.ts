import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../shared/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})


export class SignupComponent {

constructor(private auth: AuthServiceService, private router: Router) { }
  
loading = false;
  serverError = '';
  showPassword = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('user')
  });


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.serverError = '';
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.message || 'Registration failed';
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }
  
}
