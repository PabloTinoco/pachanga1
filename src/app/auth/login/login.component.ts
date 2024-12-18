import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

 ngOnInit() {
  console.log('Formulario login inicializado:', this.loginForm);
  console.log('Email control:', this.loginForm.get('email'));
  console.log('Password control:', this.loginForm.get('password'));
}

  onSubmit(): void {
    console.log("Submit login");
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);
          localStorage.setItem('token', response.token); // Guardar el token en el localStorage
          this.router.navigate(['/home']); // Redirigir al perfil o página principal
        },
        error: (error) => {
          console.error('Error en el inicio de sesión:', error);
        },
      });
    } else {
      console.error('Formulario no válido');
    }
  }

}
