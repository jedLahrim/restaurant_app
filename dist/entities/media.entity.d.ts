import { BaseEntity } from 'typeorm';
export declare class Media extends BaseEntity {
    id: string;
    outputVideo: string;
    created_by: string;
    pid: number;
    created_at: Date;
    updated_at: Date;
}
