import { UserModuleRoleDataDTO } from './../dtos/userModuleRoles.DTO';
interface DataStoredInToken {
  user_id: string;
  uuid: string;
  adminUser: boolean;
  devUser: boolean;
  bizUser: boolean;
  site_code: string;
  createTimeStamp: string;
  expiryInSec: number;
  roles: UserModuleRoleDataDTO[];
}

export default DataStoredInToken;