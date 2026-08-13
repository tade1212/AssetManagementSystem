import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  // Ensure this port matches your running .NET API
  private apiUrl = 'http://localhost:5000/api/organizations';

  constructor(private http: HttpClient) {}

  /**
   * Helper to get Authorization headers with the JWT token
   */
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Fetches the full organizational tree
   */
  getHierarchy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hierarchy`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Creates a new organizational unit
   * Uses HttpParams to safely build the query string: ?name=Value&parentId=123
   */
  createUnitAsync(name: string, parentId: number | null): Observable<any> {
    // We explicitly set the params in the URL
    // Format: http://localhost:5000/api/organizations?name=IT&parentId=1
    let url = `${this.apiUrl}?name=${encodeURIComponent(name)}`;

    if (parentId !== null && parentId !== undefined) {
      url += `&parentId=${parentId}`;
    }

    // We send an empty object {} as the body
    return this.http.post(url, {}, { headers: this.getHeaders() });
  }
  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
