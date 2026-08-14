import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createUser(userData: any, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?password=${password}`, userData, {
      headers: this.getHeaders(),
    });
  }

  // ADDED THIS
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() });
  }

  // ADDED THIS
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  resetPassword(id: number, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${id}/reset-password?newPassword=${newPassword}`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}

