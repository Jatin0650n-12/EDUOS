import { Component } from '@angular/core';
import { AuthServiceService } from '../shared/auth-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated$!: Observable<boolean>;

  constructor(private authService: AuthServiceService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  logout() {
    this.authService.logout();
  }
}
