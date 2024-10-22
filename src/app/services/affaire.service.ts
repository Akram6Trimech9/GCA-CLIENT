import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getAffaireById(affaireId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${affaireId}`);
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

  getAllAffaireByAvocat(avocatId: number, filters?: { clientName?: string; folderNumber?: string; degre?: string; page?: number; limit?: number }): Observable<any> {
    let params = new HttpParams()
      .set('page', filters?.page?.toString() || '1') // Default to page 1 if not provided
      .set('limit', filters?.limit?.toString() || '10'); // Default to limit 10 if not provided

     if (filters?.clientName) {
      params = params.set('clientName', filters.clientName);
    }
    if (filters?.folderNumber) {
      params = params.set('folderNumber', filters.folderNumber);
    }
    if (filters?.degre) {
      params = params.set('degre', filters.degre);
    }

    return this.http.get<any>(`${this.apiUrl}/avocat/${avocatId}`, { params });
  }

  addIntervToAffaire(affaireId : any , intervenantId : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/intervenant/${affaireId}`,{intervenantId})
 }


 generateFacture(affaireId: string) {
  const headers = new HttpHeaders({ 'Accept': 'application/pdf' });

  return this.http.get(`http://localhost:3000/api/affaires/generatePdf/${affaireId}`, {
    headers: headers,
    responseType: 'blob'  
  });
}
}