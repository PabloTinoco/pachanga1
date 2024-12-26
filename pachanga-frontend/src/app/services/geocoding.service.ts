import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    return this.http.get(url).pipe(
      map((data: any) => {
        return {
          country: data.address.country,
          city: data.address.city || data.address.town || data.address.village,
          postalCode: data.address.postcode,
          address: `${data.address.road || ''} ${data.address.house_number || ''}`.trim(),
          country_code: data.address.country_code ,
          region: data.address.state,
        };
      })
    );
  }
}
