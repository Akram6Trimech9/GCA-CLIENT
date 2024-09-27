import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

 export interface ParEmail {
  _id?: string;
  email: string;
  message: string;
  avocat?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private baseUrl = `${environment.baseurl}/emails`; 

  constructor(private _http: HttpClient) {}

   createEmail(emailData: ParEmail): Observable<ParEmail> {
    return this._http.post<ParEmail>(`${this.baseUrl}`, emailData);
  }

   getAllEmails(): Observable<ParEmail[]> {
    return this._http.get<ParEmail[]>(`${this.baseUrl}`);
  }

   getEmailsByAvocat(avocatId: string): Observable<ParEmail[]> {
    return this._http.get<ParEmail[]>(`${this.baseUrl}/avocat/${avocatId}`);
  }

   getEmailById(id: string): Observable<ParEmail> {
    return this._http.get<ParEmail>(`${this.baseUrl}/${id}`);
  }

   updateEmail(id: string, emailData: ParEmail): Observable<ParEmail> {
    return this._http.put<ParEmail>(`${this.baseUrl}/${id}`, emailData);
  }

   deleteEmail(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
