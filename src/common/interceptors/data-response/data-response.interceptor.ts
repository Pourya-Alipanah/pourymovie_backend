import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';


/**
 * DataResponseInterceptor
 * @description This interceptor is responsible for transforming the response data.
 * It removes the paginated property from the response data.
 */
@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  /**
   * intercept
   * @param context
   * @param next
   * @returns Observable<any>
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('Response data before check:', data);
        if (data && data.paginated) {
          const { paginated, ...rest } = data;
          return rest;
        }
        return { data };
      }),
    );
  }
}
