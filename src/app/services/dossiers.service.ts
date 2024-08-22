import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  constructor(private http: HttpClient ) { }
 
  private baseUrl = `${environment.baseurl}/dossiers` ; 

 
  getAllDossiers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getall`);
  }

  getDossierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/${id}`);
  }

  createDossier(dossier: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save`, dossier);
  }

  updateDossier(id: number, dossier: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, dossier);
  }

  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
  getFolderByAdminId(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/dossiers/getall`);
  }
}
