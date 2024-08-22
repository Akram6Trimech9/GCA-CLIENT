import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAudiance } from '../core/models/audiance';

@Injectable({
  providedIn: 'root'
})
export class AudianceService {
  private baseUrl = `${environment.baseurl}/audiences` ; 

  constructor(private http: HttpClient) {}

  getAudiencesByAffaireId(affaireId: Number): Observable<IAudiance[]> {
    return this.http.get<IAudiance[]>(`${this.baseUrl}/byAffaire/${affaireId}`);
  }

    getAudiencesByDate(date: string): Observable<IAudiance[]> {
    const url = `${this.baseUrl}/byDate/${date}`;
    return this.http.get<IAudiance[]>(url);
  }

   addAudience(audience: any , adminID :Number | undefined, affaireId:Number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save/${adminID}/${affaireId}`, audience);
  }

   updateAudience(id: number, audience: IAudiance): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, audience);
  }

   deleteAudience(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
