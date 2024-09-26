import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustificationService {

  private baseUrl = `${environment.baseurl}/justification` ; 

  constructor( private _http: HttpClient) {
   }


   updateJustification(idJustificiation : any , justification : any): Observable<any>{ 
     return this._http.put<any>(`${this.baseUrl}/${idJustificiation}` , justification)
   }



}
