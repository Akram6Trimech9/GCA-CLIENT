import { Role } from "../constant/role";

export interface IUser{
    id?: Number;
    username: String,
    lastname: String,
    email: String,
    password: String,
    token?: string;
    role: Role
    dateOfBirth?:Date,
    cin?:String ,
    telephone1?:String ,
    adresse?:String 
}
export interface AuthRequest {
    email: string;
    password: string;
  }