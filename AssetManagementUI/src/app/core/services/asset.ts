import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiUrl = 'http://localhost:5000/api/assets';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  uploadDocument(assetId: number, file: File, docType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);

    // This calls your .NET endpoint: POST /api/Assets/{id}/documents
    return this.http.post(`${this.apiUrl}/${assetId}/documents`, formData, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`),
    });
  }
  // ADD THIS FUNCTION
  createAsset(assetData: any): Observable<any> {
    // Matches your .NET Controller: api/Assets?name=..&tag=..&description=..&categoryId=..&orgUnitId=..
    let params = new HttpParams()
      .set('name', assetData.name)
      .set('tag', assetData.assetTag)
      .set('description', assetData.description || '')
      .set('categoryId', assetData.categoryId.toString())
      .set('orgUnitId', assetData.organizationUnitId.toString());

    return this.http.post(
      this.apiUrl,
      {},
      {
        headers: this.getHeaders(),
        params: params,
      },
    );
  }

  deleteAsset(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
