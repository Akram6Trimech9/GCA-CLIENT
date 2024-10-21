import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  private baseUrl = `${environment.baseurl}/cabinet` ; 
  constructor(private http: HttpClient ) { }

  postCabinet( adminId : any ,cabinet : any) :Observable<any>{ 
     return this.http.post<any>(`${this.baseUrl}/${adminId}` , cabinet)
  }

  updateCabinet(adminId: any , cabinet : any):Observable<any>{ 
    return this.http.put<any>(`${this.baseUrl}/${adminId}` , cabinet)
 }


 getCabinet(adminId: any ):Observable<any>{ 
  return this.http.get<any>(`${this.baseUrl}/${adminId}`)
}

deleteCabinet(cabinetId : any) : Observable<any>{ 
   return this.http.delete<any>(`${this.baseUrl}/${cabinetId}`)
}

getCabinetBySousAdmin(sousAdminId : any) : Observable<any>{ 
  return this.http.get<any>(`${this.baseUrl}/sousadmin/${sousAdminId}`)
}

}
