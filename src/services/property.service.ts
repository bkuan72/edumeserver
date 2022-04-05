/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import SysEnv from '../modules/SysEnv';

export class PropertyService {
  constructor() {
    return;
  }

  /**
   * Put Property using PROPERTY microservie
   * @returns properties DTO array
   */
  getProperty(
    data: any
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      const body: Uint8Array[] = [];
      let properties: any[] | PromiseLike<any[]> = [];

      const jsonData = JSON.stringify(data);
      const options: http.RequestOptions = {
        host: SysEnv.PROPERTY_SERVICE + ':' + SysEnv.PROPERTY_SERVICE_PORT,
        hostname: SysEnv.PROPERTY_SERVICE,
        port: SysEnv.PROPERTY_SERVICE_PORT,
        path: '/api/properties/getter',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': jsonData.length
        }
      };

      console.info(options);
      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
          body.push(d);
        });
        res.on('end', ()=>{
          const data = Buffer.concat(body).toString();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            properties = JSON.parse(data);
            console.info(properties);
          } else {
            console.error(data);
          }
          resolve(properties);
        });
      });
      req.on('error', (error) => {
        console.error(error);
        resolve(properties);
      });
      console.info(jsonData);
      req.write(jsonData);
      req.end();

    });
  }

}
