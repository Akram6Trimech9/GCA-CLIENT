import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthRequest, IUser } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role } from '../constant/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.baseurl}/user`;
  private currentUser: IUser | null = null;
  private currentUserKey = 'currentUser';
  private currentUserSubject$ = new BehaviorSubject<IUser | null>(this.getCurrentUserFromLocalStorage());
  public current = this.currentUserSubject$.asObservable();     
  constructor(private http: HttpClient, private router: Router) {
    this.currentUser = this.getCurrentUserFromLocalStorage();
  }

  getName(): String {
    return this.currentUser?.username || '';
  }
   
  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/user/avocat`);
  }
  getAllClients(id:any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/user/client/${id}`);
  }


  getUserById(id: any):Observable<any>{
    return this.http.get<any>(`${environment.baseurl}/user/one-user/${id}`);

     
  }
  searchClient(id: string, searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/user/search/client/${id}`, {
      params: { query: searchTerm }
    });
  }
   
  setCurrentUser(user: IUser): void {
    this.currentUser = user;
    this.currentUserSubject$.next(this.currentUser)
    this.storeUserInLocalStorage(user);
  }

  getCurrentUserFromLocalStorage(): IUser | null {
    const storedUser = localStorage.getItem(this.currentUserKey);
    return storedUser ? JSON.parse(storedUser) as IUser : null;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
    this.removeUserFromLocalStorage();
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUserFromLocalStorage();
  }
  isAdmin():boolean {
    return this.getCurrentUserFromLocalStorage()?.role == Role.ADMIN 

  }

 

  login(request: AuthRequest): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/login`, request).pipe(
      tap((user: IUser) => {
        this.setCurrentUser(user); 
       })
    );
  }

  loginAdmin(request: AuthRequest): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/loginadmin`, request).pipe(
      tap((user: IUser) => {
        this.setCurrentUser(user); 
       })
    );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgotpassword` , {email});
  }

  resetPassword(token: string, request: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/resetpassword/${token}`, request);
  }

  activateAccount(token: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-account`,token);
  }

  getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  private storeUserInLocalStorage(user: IUser): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  private removeUserFromLocalStorage(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  register(registerData: FormData ): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, registerData);
  }
 
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

 
  logout(): void {
    this.clearCurrentUser();
    this.currentUserSubject$.next(null)
    this.router.navigate(['/client/login']); }

    logoutAdmin(): void {
      this.clearCurrentUser();
      this.currentUserSubject$.next(null)
      this.router.navigate(['/authAdmin/adminstratorLogin']);
     }
  
  update(id:any , user :any) : Observable<any>{
     return this.http.put<any>(`${this.apiUrl}/update-user/${id}`,user)
  }
    
  
  
  
}
 
