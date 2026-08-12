import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://localhost:5000/api/organizations';

  constructor(private http: HttpClient) { }

  // We need to send the Token so the API knows we are logged in
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getHierarchy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hierarchy`, { headers: this.getHeaders() });
  }
}