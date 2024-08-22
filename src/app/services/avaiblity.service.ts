import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaiblityService {

  constructor(private http: HttpClient ) { }
 
 
  getAvailabilitiesByAdmin(adminId: Number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/admin-availabilities/getByAdmin/${adminId}`);
  }
  createAvailability(adminId: Number, availability: any): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/admin-availabilities/create/${adminId}`, availability);
  }
}
