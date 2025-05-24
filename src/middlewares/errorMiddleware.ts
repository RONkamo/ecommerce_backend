import {Request,Response, NextFunction } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error:HttpException,req:Request,res:Response,next:NextFunction)=>{
      res.status(error.statusCode).json({
        messgae:error.message,
        errorCode:error.errorCode,
        errors:error.errors
    })
}