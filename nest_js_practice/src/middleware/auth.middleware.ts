
import {Request, Response,NextFunction} from "express"
export function AuthMiddleware(req:Request, res:Response,next:NextFunction) {
    console.log("auth middleware is called....")
    next()
}