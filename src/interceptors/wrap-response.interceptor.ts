import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export default class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((...args) => {
        if (typeof args[0] === 'object') {
          const keys = Object.keys(args[0]);
          if (
            keys.includes('data') ||
            keys.includes('message') ||
            keys.includes('statusCode')
          )
            return args[0];
        }

        return {
          data: args[0],
        };
      }),
    );
  }
}
