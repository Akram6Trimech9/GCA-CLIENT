import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class AffaireService {

  private apiUrl = `${environment.baseurl}/affaires`;

  constructor(private http: HttpClient) { }

   fetchAffaires(dossierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dossier/${dossierId}`);
  }

   deleteAffaire(affaireId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${affaireId}`);
  }

   addAffaire(affaire: any, dossierId: number): Observable<any> {
    affaire.dossier = { id: dossierId };
    return this.http.post(`${this.apiUrl}/${dossierId}`, affaire);
  }

   updateAffaire(affaireID: any,affaire:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${affaireID}`, affaire);
  }
  getAllAffaireByAdmin(adminId : any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/admin/${adminId}` )
  }

  getAllAffaireByClient(clientId : any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/client/${clientId}` )
  }

  addIntervToAffaire(affaireId : any , intervenantId : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/intervenant/${affaireId}`,{intervenantId})
 }
}
