import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private apiUrl = 'http://localhost:5000/api/court';

  constructor(private http: HttpClient) {}

  createCourt(courtData: any): Observable<any> {
    console.log(courtData);
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/register`, courtData, { headers });
  }

  getAllCourts(): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/all`, { headers });
  }

  getCourtsByCountry(country_code: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/country/${country_code}`, { headers });
  }

}
