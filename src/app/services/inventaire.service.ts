import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAudiance } from '../core/models/audiance';

@Injectable({
  providedIn: 'root'
})
export class intervenantService {

  private baseUrl = `${environment.baseurl}/inventaire` ; 

  constructor(private http: HttpClient) {}

  getAllintervenant(searchName: string = '', searchType: string = '', page: number = 1, limit: number = 10): Observable<any> {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
    };
  
    if (searchName) {
      params.full_name = searchName;
    }
  
    if (searchType) {
      params.typeInventaire = searchType;
    }
  
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }
  
  addintervenant(intervenant:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,intervenant );
  }
 
}
