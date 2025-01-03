import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:5000/api/group'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) {}

  getGroupsByCourt(court_id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/search/${court_id}`, { headers });
  }

  createGroup(group: any): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/create`, group, { headers });
  }

  getGroupDetails(court_id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/${court_id}/details`, { headers });
  }

  isMember(court_id: string): Observable<any> {
    const token = localStorage.getItem('AuthToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/${court_id}/isMember`, { headers });
  }
}
