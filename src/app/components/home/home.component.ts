import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements AfterViewInit {
  private map!: L.Map;

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

    this.map.invalidateSize();
  }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      const customIcon = L.icon({
        iconUrl: 'assets/images/marker-icon.png',
        shadowUrl: 'assets/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

      navigator.geolocation.getCurrentPosition((position) => {
        const coords:[number, number] = [position.coords.latitude, position.coords.longitude];
        this.map.setView(coords, 13);
        L.marker(coords, { icon: customIcon }).addTo(this.map).bindPopup('Tu ubicación').openPopup();

        this.map.invalidateSize();

      });
    } else {
      alert('La geolocalización no está soportada por este navegador.');
    }
  }
}
