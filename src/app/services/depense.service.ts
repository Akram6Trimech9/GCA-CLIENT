import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepenseService {
  private baseUrl = `${environment.baseurl}/depense`; 

  constructor(private _http: HttpClient) { }

   getDepenseStatus(adminId: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/status/${adminId}`);
  }

   createDepense(adminId: string): Observable<any> {
    return this._http.post(this.baseUrl, { adminId });
  }

   updateDepense(depenseId: string, total: number): Observable<any> {
    return this._http.put(this.baseUrl, { depenseId, total });
  }

   createResource(adminId: string, montant: number, description: string, date: Date): Observable<any> {
    return this._http.post(`${this.baseUrl}/resources`, { adminId, montant, description, date });
  }

   removeResource(depenseId: string, resourceId: string): Observable<any> {
    return this._http.delete(`${this.baseUrl}/resources/${depenseId}/${resourceId}`);
  }

   updateResource(depenseId: string, resourceId: string, montant: number, description: string, date: Date): Observable<any> {
    return this._http.put(`${this.baseUrl}/resources/${depenseId}/${resourceId}`, { montant, description, date });
  }

   getAllResources(depenseId: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/resources/${depenseId}`);
  }

   getTotal(depenseId: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/total/${depenseId}`);
  }

  getTotalByAdmin(adminId: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/total/admin/${adminId}`);
  }

   updateTotal(depenseId: string, total: Number): Observable<any> {
    return this._http.put(`${this.baseUrl}/total/${depenseId}/${total}`, {});
  }
}
