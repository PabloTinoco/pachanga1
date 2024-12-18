import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourtService } from '../../services/court.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.less']
})
export class CourtComponent {
  courtForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courtService: CourtService,
    private router: Router
  ) {
    this.courtForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required],
      coordinateX: ['', Validators.required],
      coordinateY: ['', Validators.required],
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
}
