import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {

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
