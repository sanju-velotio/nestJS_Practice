import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import {Observable, tap} from "rxjs"


@Injectable()
export class UserInterCeptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');
        const request= context.switchToHttp().getRequest()
        console.log(request.params)
        return next
          .handle()
          .pipe(
            tap((response) =>{
                console.log("return response data",response)
            }),
          );
      }
    
}