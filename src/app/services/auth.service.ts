import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, tap  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Cambia esto por la URL de tu backend

  constructor(private http: HttpClient, private router: Router) {}

  // Método para registrar un usuario
  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      role
    });
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Guarda el token
        }
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Falló el inicio de sesión'));
      })
    );
  }


  // Método para verificar si el usuario está autenticado (basado en el token)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para obtener el token JWT almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.logout(); // Limpia el token y redirige
        }
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    return this.http.post('http://localhost:5000/api/auth/logout', {});
  }


}
