import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  constructor(private http: HttpClient ) { }
 
  private baseUrl = `${environment.baseurl}/folder` ; 

 
  getAllDossiers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getDossierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/${id}`);
  }

  createDossier(dossier: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dossier);
  }

  updateDossier(id: number, dossier: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, dossier);
  }

  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
  getFolderByAdminId(avocatId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/avocat/${avocatId}`);
  }
  getFolderByClient(clientId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/client/${clientId}`);
  }

  updateExecuted(folderId:any , isExecuted : any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${folderId}/executed`,{isExecuted});
  }
  updateReactified(folderId:any  , isRectified : any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${folderId}/rectified` , {isRectified});
  }

  transfertFolder(data:any  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transfer-folder` ,  data);
  }
 }
