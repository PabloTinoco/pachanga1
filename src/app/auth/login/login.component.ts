import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', [Validators.required])
    });
  }


  onLogin(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('token', response.token); // Guardar el token en el localStorage
        this.router.navigate(['/home']); // Redirigir al perfil o página principal
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
      }
    });
  }

}
