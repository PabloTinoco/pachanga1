import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({ selector: 'app-root', templateUrl: 'app.component.html',standalone: true, imports: [CommonModule,RouterModule] })
export class AppComponent {

    constructor(private authService: AuthService) {

    }

    isLogin():boolean{
      return this.authService.isLoggedIn();
    }

    logout():void{
      this.authService.logout();
    }


}
