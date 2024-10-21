export interface Cabinet {
    _id?:any
    name: string;
    address: string;
    description: string;
    localisation: string;
    admin?: any;
    sousAdmins?:any[];
  }