import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private apiUrl = 'http://localhost:5000/api/court';

  constructor(private http: HttpClient) {}

  createCourt(courtData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, courtData);
  }
}
