import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CerclesService {
  constructor(private http: HttpClient ) { }
 
 
  getDelegation(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/delegation`);
  }
   
  getCercles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/cercles`);
  }
  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/cities`);
  }
  getTribinaux(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/tribinaux`);
  } 
}
