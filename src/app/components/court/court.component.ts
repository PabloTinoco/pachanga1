import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourtService } from '../../services/court.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.less'],
  standalone: false
})
export class CourtComponent {
  courtForm: FormGroup;
  countries: any[] = [];
  cities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private courtService: CourtService,
    private router: Router,
    private http: HttpClient
  ) {
    this.courtForm = this.fb.group({
      name: ['', Validators.required, Validators.minLength(3)],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required,Validators.pattern(/^\d{4,6}$/)],
      address: ['', Validators.required],
      coordinateX: ['', Validators.required, this.coordinateValidator],
      coordinateY: ['', Validators.required, this.coordinateValidator],
    });

    // Cargar lista de países
    this.http.get('https://restcountries.com/v3.1/all').subscribe((countries: any) => {
      this.countries = countries.map((c: any) => ({
        name: c.name.common,
        code: c.cca2,
      }));
    });
  }

  onSubmit(): void {
    if (this.courtForm.valid) {
      this.courtService.createCourt(this.courtForm.value).subscribe({
        next: (response) => {
          console.log('Cancha añadida:', response);
          alert('Cancha añadida exitosamente');
          this.router.navigate(['/home']); // Redirigir a Home
        },
        error: (error) => {
          console.error('Error al añadir cancha:', error);
          alert('Error al añadir la cancha');
        },
      });
    }
  }

  onCountryChange(countryCode: string): void {
    // Obtener ciudades según el país
    this.http
      .get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/cities`, {
        headers: {
          'X-RapidAPI-Key': 'YOUR_API_KEY',
        },
      })
      .subscribe((response: any) => {
        this.cities = response.data.map((city: any) => city.name);
      });
  }

  coordinateValidator(control: any): { [key: string]: any } | null {
    const coordinatePattern = /^-?\d+(\.\d+)?$/;
    if (control.value && !coordinatePattern.test(control.value)) {
      return { invalidCoordinate: true };
    }
    return null;
  }
}
