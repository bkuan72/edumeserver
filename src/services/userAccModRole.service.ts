/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import SysEnv from '../modules/SysEnv';

export class UserAccModRoleService {
  constructor() {
    return;
  }

  /**
   * Get UserAccModRole using USERACCMODROLE microservie
   * @returns userAccModRoles DTO array
   */
  getUserAccModRole(): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      const body: Uint8Array[] = [];
      let userAccModRoles: any[] | PromiseLike<any[]> = [];
      const options: http.RequestOptions = {
        host: SysEnv.USER_ACC_MOD_ROLE_SERVICE + ':' + SysEnv.USER_ACC_MOD_ROLE_SERVICE_PORT,
        hostname: SysEnv.USER_ACC_MOD_ROLE_SERVICE,
        port: SysEnv.USER_ACC_MOD_ROLE_SERVICE_PORT,
        path: '/api/SysCheckUserAccountModuleRole',
        method: 'GET'
      };

      console.info(options);
      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
          body.push(d);
          const data = Buffer.concat(body).toString();
          userAccModRoles = JSON.parse(data);
          console.info(data);
        });
        res.on('end', ()=>{
          resolve(userAccModRoles);
        });
      });
      req.on('error', (error) => {
        console.error(error);
        resolve(userAccModRoles);
      });

      req.end();
    });
  }

}
