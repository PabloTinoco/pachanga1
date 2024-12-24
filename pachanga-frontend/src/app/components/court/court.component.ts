import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CourtService } from '../../services/court.service';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.less'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule ]
})
export class CourtComponent implements OnInit {
  courtForm: FormGroup;
  countries: any[] = [];
  cities: string[] = [];

  private apiUrlCountries = 'https://countriesnow.space/api/v0.1/countries';
  private apiUrlCities = 'https://countriesnow.space/api/v0.1/countries/cities';

  ngOnInit(): void {
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

  constructor(
    private fb: FormBuilder,
    private courtService: CourtService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {
    this.courtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required,Validators.pattern(/^\d{4,6}$/)]],
      address: ['', Validators.required],
      coordinateX: ['', [Validators.required, this.coordinateValidator]],
      coordinateY: ['', [Validators.required, this.coordinateValidator]],
    });

  }

  onSubmit() {
    if (this.courtForm.valid) {
      this.courtService.createCourt(this.courtForm.value).subscribe({
        next: (data: any) => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/home']);
        },
        error: (data: any) => {
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });

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

  coordinateValidator(control: any): { [key: string]: any } | null {
    const coordinatePattern = /^-?\d+(\.\d+)?$/;
    if (control.value && !coordinatePattern.test(control.value)) {
      return { invalidCoordinate: true };
    }
    return null;
  }
}
