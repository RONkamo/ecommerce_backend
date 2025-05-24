//message, status code, error code , error


export class HttpException extends Error{
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    errors: any;

    constructor (message:string,errorCode:ErrorCode,statusCode:number,error:any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors =error

    }
}

export enum ErrorCode{
    PASSWORD_EMAIL_NOT_FILL = 1000,
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIT = 1002,
    INCORRECT_PASSWORD_EMAIL= 1003,
    UNPROCESSABLE_ENTITY = 20001,
}