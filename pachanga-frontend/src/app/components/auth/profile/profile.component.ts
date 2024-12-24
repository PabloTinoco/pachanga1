import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone:true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  profileData: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: data => {
        this.profileData = data;
      },
      error: error => {
        console.error('Error al obtener el perfil:', error);
      },
      complete: () => {
        console.log('Completado');
      }
    });
  }
}
