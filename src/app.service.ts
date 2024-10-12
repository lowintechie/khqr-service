import { Injectable } from '@nestjs/common';
import path from 'path';

@Injectable()
export class AppService {

  getHello(): object {
    return welcome();
  }
}


function welcome(){
  return {
    message: 'Welcome to the (KHQR) API',
    API: 'www.khqr.sanawin.icu',
    endpoints: [
      {
        method: 'POST',
        path: '/khqr/create'
      },
      {
        method: 'POST',
        path: '/khqr/check-transactions'
      }
    ],
    "ទំនាក់ទំនង": "Telegram: @khqrbot ឬ Admin: @sanawin"
  }
}
