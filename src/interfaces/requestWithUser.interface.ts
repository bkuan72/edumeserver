import { Request } from 'express';
import { ResponseUserDTO } from '../dtos/userDTO';
 
interface RequestWithUser extends Request {
  user: ResponseUserDTO;
}
 
export default RequestWithUser;