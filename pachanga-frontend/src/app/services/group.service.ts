import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:5000/api/group'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) {}

  getGroupsByCourt(courtId: string): Observable<any> {
    const token = localStorage.getItem('AuthToken'); // Asumiendo que guardas el token en localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/search/${courtId}`, { headers });
  }

  createGroup(group: any): Observable<any> {
    const token = localStorage.getItem('AuthToken'); // Asumiendo que guardas el token en localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(group);
    return this.http.post<any>(`${this.apiUrl}/create`, group, { headers });
  }
}
