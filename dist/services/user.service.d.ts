import express, { Request, Response } from "express";
export declare class UserService {
    private userRepo;
    private mediaRepo;
    private configService;
    getAll(req: any, res: any): Promise<void>;
    findOne(req: Request, res: Response): Promise<express.Response<any, Record<string, any>>>;
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<express.Response<any, Record<string, any>>>;
    private _generateToken;
    loginWithFacebook(): void;
    callback(req: any, res: any): Promise<void>;
    loginWithGoogle(): void;
    callbacks(req: any, res: any): void;
    loginWithTwitter(): void;
    twitterCallback(req: any, res: any): void;
    generateQRCode(res: Response): Promise<void>;
    upload(req: Request, res: Response): Promise<express.Response<any, Record<string, any>>>;
    private _getFileExtension;
    uploadFile(req: any, res: any): Promise<void>;
    private _getAwsUploadParams;
    private _transcodeVideo;
    remove(req: any, res: Response): Promise<any>;
}
