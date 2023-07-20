import { Request, Response, NextFunction } from "express"
export function UserMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers)
    next()
}