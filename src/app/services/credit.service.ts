import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient) { }

  postCredit(credit: any): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/credit`,credit);
  }
  deleteCredit(creditId : any): Observable<any>{ 
     return this.http.delete<any>(`${environment.baseurl}/credit/${creditId}`)
  }
  getCredit():Observable<any>{ 
     return this.http.get<any>(`${environment.baseurl}/credit`)
  }
  getCreditByAvocat( avocatId : any):Observable<any>{ 
    return this.http.get<any>(`${environment.baseurl}/credit/avocat/${avocatId}`)
 }
 getCreditByClient( clientId : any):Observable<any>{ 
  return this.http.get<any>(`${environment.baseurl}/credit/client/${clientId}`)
}


 addTranch(  creditId:any, tranch:any):Observable<any>{ 
  return this.http.post<any>(`${environment.baseurl}/credit/tranch/${creditId}`,tranch)
}
deleteTranch( trancheId : any,creditId:any) :Observable<any>{ 
   return  this.http.delete<any>(`${environment.baseurl}/credit/tranch/${trancheId}/${creditId}`)
}
updateTotal(total : any,creditId:any) :Observable<any>{ 
  return this.http.put<any>(`${environment.baseurl}/credit/total/${creditId}`,total)
}
}
