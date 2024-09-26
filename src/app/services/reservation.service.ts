import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) { }

  createReservation(clientId: Number | undefined, availabilityId: number, reservationTime: string,avocatId:String ): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/rdvs/${clientId}/${avocatId}`,{reservationTime:reservationTime,displonibilty:availabilityId});
  }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/getall`);
  }

  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseurl}/${id}`);
  }

  getReservationsByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/by-client/${clientId}`);
  }

  getReservationsByAvailability(availabilityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/by-availability/${availabilityId}`);
  }

  updateReservation(id: number, reservationDetails: any): Observable<any> {
    return this.http.put<any>(`${environment.baseurl}/update/${id}`, reservationDetails);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseurl}/delete/${id}`);
  }
}
