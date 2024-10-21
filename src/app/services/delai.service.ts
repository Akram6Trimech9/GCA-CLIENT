import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DelaiService {
  private baseUrl = `${environment.baseurl}/delai` ; 

  constructor(private _http : HttpClient) { }


  getAllDelai() : Observable<any>{ 
     return this._http.get<any>(`${this.baseUrl}`)
  }

  getDelaiByAvocat(avocatId : any) : Observable<any>{ 
    return this._http.get<any>(`${this.baseUrl}/avocat/${avocatId}`)
 }
}
