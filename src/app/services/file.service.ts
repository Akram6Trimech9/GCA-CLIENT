import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GsFolder } from '../core/models/folder';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { File } from '../core/models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = `${environment.baseurl}/file` ; 

  constructor(private _http : HttpClient) { }


  createFolder(folder : any) :Observable<GsFolder>{
      return this._http.post<GsFolder>(`${this.baseUrl}/folders`,folder)
  }

  getAllRoot(userId: string): Observable<{ folders: GsFolder[], files: File[] }> {
    return this._http.get<{ folders: GsFolder[], files: File[] }>(`${this.baseUrl}/root-items/${userId}`);
  }


  createFile(formdata : FormData) :Observable<GsFolder>{
    return this._http.post<GsFolder>(`${this.baseUrl}/files`,formdata)
}

getSubFolderAndSubFiles(folderId:any): Observable<{ folders: GsFolder[], files: File[] }>{
  return this._http.get<{ folders: GsFolder[], files: File[] }>(`${this.baseUrl}/folder-items/${folderId}`);

}

 
}
