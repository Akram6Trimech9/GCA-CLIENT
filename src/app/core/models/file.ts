import { GsFolder } from "./folder";
import { IUser } from "./user";
export interface File {
    _id?: string;  
    name: string;
    type: string;
    path: string;
    folder?: GsFolder | null; 
    createdBy: IUser;  
    transferredTo?: IUser; 
    isRoot: boolean; 
    createdAt?: Date;  
    updatedAt?: Date;  
}
