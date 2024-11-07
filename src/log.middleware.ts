import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const endpoint = req.originalUrl
    const body = req.body

    console.log(`New Request from ${req.ip} requesting ${endpoint}`)
    next()
  }
}