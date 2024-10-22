import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesService {

  private baseUrl = environment.baseurl; 

  constructor(private http: HttpClient) { }

   createProces(folderId: string, procesData: FormData): Observable<any> {
    const url = `${this.baseUrl}/proces/${folderId}`;
    return this.http.post(url, procesData);
  }

  getProcesByFolder(folderId: string, page: number = 1, limit: number = 10): Observable<any> {
    const url = `${this.baseUrl}/proces/folder/${folderId}?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }
  
   getProcesByClient(clientId: string, page: number = 1, limit: number = 10): Observable<any> {
    const url = `${this.baseUrl}/proces/client/${clientId}?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }

  updateProces(procesId: string, procesData: FormData): Observable<any> {
    const url = `${this.baseUrl}/proces/${procesId}`;
    return this.http.put(url, procesData);
  }


  searchProces(
    searchParams: { 
      folderNumber?: string, 
      username?: string, 
      lastname?: string, 
      nbreTribunal?: number, 
      type?: string, 
      page?: number, 
      limit?: number 
    }
  ): Observable<any> {
    let params = new HttpParams();
    
     if (searchParams.folderNumber) {
      params = params.set('folderNumber', searchParams.folderNumber);
    }
    if (searchParams.username) {
      params = params.set('username', searchParams.username);
    }
    if (searchParams.lastname) {
      params = params.set('lastname', searchParams.lastname);
    }
    if (searchParams.nbreTribunal !== undefined && searchParams.nbreTribunal !== null) {
      params = params.set('nbreTribunal', searchParams.nbreTribunal.toString());
    }
    if (searchParams.type) {
      params = params.set('type', searchParams.type);
    }
  
     const page = searchParams.page ?? 1;
    const limit = searchParams.limit ?? 10;
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());
  
    const url = `${this.baseUrl}/proces/search`;
    return this.http.get(url, { params });
  }
  
  
}
