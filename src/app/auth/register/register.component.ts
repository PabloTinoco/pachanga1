import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', [Validators.required])

  });

  username: string = '';
  email: string = '';
  password: string = '';
  role: string = 'user';  // Por defecto el rol es 'user'

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', [Validators.required])
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { username, email, password, role } = this.registerForm.value;
      this.authService.register(username, email, password, role).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']); // Redirigir al login después de registrarse
        },
        error: (error) => {
          console.error('Error en el registro:', error);
        }
      });
    }else{
      console.log('Error en la validación del formulario');
    }
  }

}
