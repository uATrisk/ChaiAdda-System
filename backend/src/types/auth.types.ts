import { Request } from 'express';

export interface AuthRequest extends Request{
    user?:{
        userId:String;
        role:String;
    }
};
