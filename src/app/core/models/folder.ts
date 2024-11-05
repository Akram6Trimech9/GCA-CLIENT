import { File } from "./file";
import { IUser } from "./user";

export interface GsFolder {
    _id?: string;  
    name: string;  
    createdBy: IUser; 
    parentFolder?: GsFolder| null;  
    transferredTo?: IUser | null ;  
    files?: File[]; 
    subFolders?: GsFolder[]; 
    isRoot: boolean; 
    open?:boolean,
    createdAt?: Date 
    updatedAt?: Date;  
}
