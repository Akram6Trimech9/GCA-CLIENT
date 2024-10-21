import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
}
