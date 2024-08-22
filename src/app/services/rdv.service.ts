import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
 
  constructor(private http: HttpClient) { }

  getPendingRdvs(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/rdvs/pending`);
  }

  confirmReservation(clientId: number, availabilityId: number): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/rdvs/confirm-reservation`, { clientId, availabilityId });
  }

  acceptRdv(id: number): Observable<void> {
    return this.http.put<void>(`${environment.baseurl}/rdvs/accept/${id}`, null );
  }

  rejectRdv(id: number): Observable<void> {
    return this.http.put<void>(`${environment.baseurl}/rdvs/reject/${id}`, null );
  }
}
