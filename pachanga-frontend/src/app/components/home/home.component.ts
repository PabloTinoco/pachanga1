import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { CourtService } from '../../services/court.service';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  standalone: true,
  imports: [ RouterModule]
})
export class HomeComponent implements AfterViewInit {
  private map!: L.Map;
  private currentCountry: string = '';

  constructor(private courtService: CourtService, private http: HttpClient) {}

  ngAfterViewInit(): void {
    // Inicializar el mapa
    this.map = L.map('map').setView([51.505, -0.09], 13);

    const provider = new OpenStreetMapProvider();
    const searchControl =  GeoSearchControl({
      provider: provider,
      style: 'bar',
      autoClose: true,
    });
    this.map.addControl(searchControl);

    // Agregar capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Preguntar por ubicación del dispositivo
    this.getCurrentLocation();

    // Detectar cambios en el mapa
    this.map.on('moveend', this.onMapMove.bind(this));

    this.map.invalidateSize();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {
        const coords:[number, number] = [position.coords.latitude, position.coords.longitude];
        this.map.setView(coords, 16);
        this.map.invalidateSize();
        this.fetchCourts(coords);
      },
      (error) => {
        console.error('Error obteniendo la localización:', error);
        // Manejar errores de geolocalización aquí
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      alert('La geolocalización no está soportada por este navegador.');
    }
  }


  private async fetchCourts(coords: [number, number]): Promise<void> {
    try {
      const response = await firstValueFrom(this.http
        .get<any>(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            format: 'json',
            lat: coords[0],
            lon: coords[1],
          },
        }));

        if (!response.address) {
          throw new Error('No address found in response');
        }

      const country_code = response.address.country_code;

      if (country_code !== this.currentCountry) {
        this.currentCountry = country_code;
        this.courtService.getCourtsByCountry(country_code).subscribe((courts) => {
          this.addCourtsToMap(courts);
        });
      }
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  }

  private addCourtsToMap(courts: any[]): void {
    courts.forEach(court => {
      const marker = L.marker([court.coordinateX, court.coordinateY]).addTo(this.map);
      marker.bindPopup(`<b>${court.name}</b><br>${court.address}<br><a href="/groups/${court.id}">Ver grupos</a>`);
    });
  }

  private onMapMove(): void {
    const center = this.map.getCenter();
    this.fetchCourts([center.lat, center.lng]);
  }

}
