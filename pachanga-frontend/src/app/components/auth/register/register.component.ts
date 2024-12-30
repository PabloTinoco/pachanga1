import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient  } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgSelectModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countries: any[] = [];
  cities: string[] = [];

  private apiUrlCountries = 'https://countriesnow.space/api/v0.1/countries';
  private apiUrlCities = 'https://countriesnow.space/api/v0.1/countries/cities';

  constructor(private authService: AuthService, private router: Router,private fb: FormBuilder,    private http: HttpClient,
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      height: ['', [Validators.required,Validators.min(60), Validators.max(260)]],
      exp: ['', [Validators.required,Validators.min(1), Validators.max(10)]],
    },
    {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup): null | { mismatch: true } {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  ngOnInit() {
    // Cargar lista de países
    this.http.get(this.apiUrlCountries)
      .subscribe({
        next: (data: any) => {
          this.countries = data.data;
        },
        error: (err: any) => {
          console.error('Error al cargar los países',err);
        }
      });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { username, email, password,  country, city, height, exp } = this.registerForm.value;
      this.authService.register(username, email, password, country, city, height, exp).subscribe({
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

  onCountryChange(event: any):void {
    const iso2 = event.iso2;
    // Obtener ciudades según el país
    this.http.post(this.apiUrlCities, { iso2 })
    .subscribe({
      next: (data: any) => {
        this.cities = data.data;
      },
      error: (err: any) => {
        console.error('Error al cargar las ciudades',err);
      }
    });
  }

}
