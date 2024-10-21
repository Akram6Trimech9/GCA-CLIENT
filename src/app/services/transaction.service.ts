import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = `${environment.baseurl}/transaction` ; 

  constructor(private http: HttpClient) { }

  getBySousAdmin(sousAdminId : any) :Observable<any>{ 
     return this.http.get(`${this.baseUrl}/to/${sousAdminId}`)
  }
  getBAdmin(adminId : any) :Observable<any>{ 
    return this.http.get(`${this.baseUrl}/from/${adminId}`)
 }
}
