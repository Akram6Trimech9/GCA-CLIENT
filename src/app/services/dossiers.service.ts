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
  getFolderByAdminId(
    avocatId: any,
    page: number = 1,
    limit: number = 10,
    searchNumber?: string,
    searchTitle?: string,
    clientId?: any,
    isRectified?: boolean,
    isExecuted?: boolean
  ): Observable<any[]> {
    let queryParams = `?page=${page}&limit=${limit}`;
  
    if (searchNumber) {
      queryParams += `&searchNumber=${searchNumber}`;
    }
  
    if (searchTitle) {
      queryParams += `&searchTitle=${searchTitle}`;
    }
  
    if (clientId) {
      queryParams += `&clientId=${clientId}`;
    }
  
    if (isRectified !== undefined) {
      queryParams += `&isRectified=${isRectified}`;
    }
  
    if (isExecuted !== undefined) {
      queryParams += `&isExecuted=${isExecuted}`;
    }
  
    return this.http.get<any[]>(`${this.baseUrl}/avocat/${avocatId}${queryParams}`);
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
