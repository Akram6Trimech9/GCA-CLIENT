import { Role } from "../constant/role"; // Assuming Role is defined in your constants
import { GsFolder } from "./folder";

export interface IUser {
    _id?: string;  
    username: string;  
    lastname: string;  
    email: string;  
    password: string;  
    token?: string;  
    role: Role; 
    dateOfBirth: Date; 
    cin?: string 
    telephone1: string;  
    telephone2?: string;  
    address?: string;  
    userProfile?: string;  
    isBlocked?: boolean; 
    verificationCode?: string; 
    adminAvaibilities?:any;
    credit?: any,
    refreshToken?:any,
    gsFolders?:GsFolder[],
    folders?:any[],
    rendezVous?:any[],
    Notifications?:any[],
    clients?:IUser[],
    sousAdminList?:IUser[],
    cabinet?:any,
    underAdmin?:IUser,
    depense?:any
 }

export interface AuthRequest {
    email: string;
    password: string;
}
