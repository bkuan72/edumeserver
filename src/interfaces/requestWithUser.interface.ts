import { Request } from 'express';
import { ResponseUserDTO } from '../dtos/user.DTO';
 
interface RequestWithUser extends Request {
  user: ResponseUserDTO;
}
 
export default RequestWithUser;