import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,  throwError  } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Cambia esto por la URL de tu backend

  constructor(private http: HttpClient, private router: Router) {}

  // Método para registrar un usuario
  register(username: string, email: string, password: string, country: string, city: string, height: number, exp: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      role: 'user',
      country,
      city,
      height,
      exp
    });
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token) {
          try {
            localStorage.setItem('AuthToken', response.token);
            console.log('Token guardado');
          } catch (error) {
            console.error('Error al guardar el token en localStorage:', error);
          } // Guarda el token
        }
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Falló el inicio de sesión'));
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('AuthToken');
    this.router.navigate(['/login']);
    return this.http.post('http://localhost:5000/api/auth/logout', {});
  }

  // Método para verificar si el usuario está autenticado (basado en el token)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('AuthToken');
  }

  // Método para obtener el token JWT almacenado
  getToken(): string | null {
    return localStorage.getItem('AuthToken');
  }

  getProfile() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/profile`,{ headers }).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.logout(); // Limpia el token y redirige
        }
        return throwError(() => new Error(error));
      })
    );
  }



}
