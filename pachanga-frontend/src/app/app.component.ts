import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  standalone: true,
})
export class AppComponent {
  title = 'pachanga-frontend';

  constructor(private authService: AuthService) {}

  isLogin():boolean{
    return this.authService.isLoggedIn();
  }

  logout():void{
    this.authService.logout();
  }
}


