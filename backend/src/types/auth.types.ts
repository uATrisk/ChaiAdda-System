import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
