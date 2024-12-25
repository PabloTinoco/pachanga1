import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CourtService } from '../../services/court.service';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { GeocodingService } from '../../services/geocoding.service';

import * as L from 'leaflet';

// Crear un icono personalizado utilizando L.Icon
const customIcon = L.icon({
  iconUrl: 'assets/images/leaflet/marker-icon.png',
  shadowUrl: 'assets/images/leaflet/marker-shadow.png',
  iconSize: [25, 41], // Tamaño del icono
  iconAnchor: [12, 41], // Punto del icono que se posicionará en las coordenadas
  popupAnchor: [1, -34], // Punto donde se abrirá el popup relativo al icono
  shadowSize: [41, 41] // Tamaño de la sombra
});

L.Marker.prototype.options.icon = customIcon;

@Component({
  selector: 'add-court',
  templateUrl: './add-court.component.html',
  styleUrls: ['./add-court.component.less'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule ]
})
export class AddCourtComponent implements OnInit {
  courtForm: FormGroup;
  countries: any[] = [];
  cities: string[] = [];

  map!: L.Map;
  marker!: L.Marker;
  showForm = false;

  private apiUrlCountries = 'https://countriesnow.space/api/v0.1/countries';
  private apiUrlCities = 'https://countriesnow.space/api/v0.1/countries/cities';

  ngOnInit(): void {
    this.initMap();
    this.getCurrentLocation();
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
    private geocodingService: GeocodingService
  ) {
    this.courtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      country: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      postalCode: [{ value: '', disabled: true }, [Validators.required,Validators.pattern(/^\d{4,6}$/)]],
      address: [{ value: '', disabled: true }, Validators.required],
      coordinateX: [{ value: '', disabled: true }, [Validators.required, this.coordinateValidator]],
      coordinateY: [{ value: '', disabled: true }, [Validators.required, this.coordinateValidator]],
    });

  }

  onSubmit() {
    if (this.courtForm.valid) {
      // Habilitar temporalmente los campos deshabilitados
      this.courtForm.get('country')?.enable();
      this.courtForm.get('city')?.enable();
      this.courtForm.get('postalCode')?.enable();
      this.courtForm.get('address')?.enable();
      this.courtForm.get('coordinateX')?.enable();
      this.courtForm.get('coordinateY')?.enable();

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

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    const provider = new OpenStreetMapProvider();
        const searchControl =  GeoSearchControl({
          provider: provider,
          style: 'bar',
          autoClose: true,
        });
        this.map.addControl(searchControl);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Forzar la actualización después de que el mapa se haya cargado
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  addMarkerAndResetMap(latlng: L.LatLng): void {
    // Eliminar el mapa existente
    this.map.remove();

    // Crear un nuevo mapa en el contenedor actualizado
    this.map = L.map('map', {
      center: latlng,
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ]
    });


    // Ajustar el tamaño del mapa después de actualizar el contenedor
    setTimeout(() => {
      this.map.invalidateSize();
      // Obtener el ancho del contenedor del mapa
      const containerWidth = this.map.getSize().x;
      const offsetX = containerWidth / 4; // Una cuarta parte del ancho del contenedor

      // Desplazar el mapa hacia la derecha
      this.map.panBy([-offsetX, 0], { animate: false });

      // Añadir el marcador en la nueva posición centrada
      this.marker = L.marker(latlng, { draggable: true }).addTo(this.map);
      this.marker.on('dragend', (e: L.DragEndEvent) => {
        this.updateFormWithLocation(this.marker.getLatLng());
      });
    }, 0);
  }

  updateFormWithLocation(latlng: L.LatLng): void {
    this.courtForm.patchValue({
      coordinateX: latlng.lat,
      coordinateY: latlng.lng
    });

    // Utilizar el servicio de geocodificación para obtener la dirección
    this.geocodingService.reverseGeocode(latlng.lat, latlng.lng).subscribe(address => {
      this.courtForm.patchValue({
        country: address.country,
        city: address.city,
        postalCode: address.postalCode,
        address: address.address
      });
    });

    // Revalidar el formulario después de actualizar los valores
    this.courtForm.updateValueAndValidity();
  }

  coordinateValidator(control: any): { [key: string]: any } | null {
    const coordinatePattern = /^-?\d+(\.\d+)?$/;
    if (control.value && !coordinatePattern.test(control.value)) {
      return { invalidCoordinate: true };
    }
    return null;
  }

  private getCurrentLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords:[number, number] = [position.coords.latitude, position.coords.longitude];
            this.map.setView(coords, 13);
            this.map.invalidateSize();

            // Habilitar el evento de clic en el mapa
            this.map.on('click', (e: L.LeafletMouseEvent) => {
              this.showForm = true;
              this.addMarkerAndResetMap(e.latlng);
              this.updateFormWithLocation(e.latlng);
            });
          },
          (error) => {
            console.error('Error obteniendo la localización:', error);
            // Manejar errores de geolocalización aquí
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        alert('La geolocalización no está soportada por este navegador.');
      }
    }
}
