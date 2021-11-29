import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import multer from 'multer';

@Injectable()
export class ParseFormDataMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await new Promise((resolve, reject) => {
      multer().any()(req, res, (err) => {
        if (err) reject(err);
        resolve(req);
      });
    });

    console.log('Parse Form Data Middleware: ' + JSON.stringify(req.body));

    next();
  }
}
