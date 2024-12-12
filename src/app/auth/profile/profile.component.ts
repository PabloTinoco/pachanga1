import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        console.log('Perfil del usuario:', this.user);
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      }
    });
  }
}
