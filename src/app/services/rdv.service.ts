import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
 
  constructor(private http: HttpClient) { }

  getPendingRdvs(avocatId: any | null): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/rdvs/all/${avocatId}`);
  }

  confirmReservation(clientId: number, availabilityId: number): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/rdvs/confirm-reservation`, { clientId, availabilityId });
  }

  acceptRdv(id: String): Observable<void> {
    return this.http.put<void>(`${environment.baseurl}/rdvs/accept/${id}`, null );
  }

  rejectRdv(id: String): Observable<void> {
    return this.http.put<void>(`${environment.baseurl}/rdvs/refuse/${id}`, null );
  }

  getRdvByClient(id :string ):Observable<any>{
     return this.http.get<any>(`${environment.baseurl}/rdvs/user/${id}`)
  }
}
