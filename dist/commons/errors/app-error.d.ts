import { ValidationOptions } from 'class-validator';
export declare class AppError {
    code: string;
    message?: string;
    constructor(code: string, message?: string);
}
export declare class CustomMatches {
    pattern: RegExp;
    validationOptions?: ValidationOptions;
    constructor(pattern: RegExp, validationOptions: ValidationOptions & any);
}
export declare const CustomMatches1: (pattern: RegExp, validationOptions?: ValidationOptions) => PropertyDecorator;
