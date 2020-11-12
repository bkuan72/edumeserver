import { Request } from 'express';
import { ResponseUserDTO } from '../dtos/ResponseUserDTO';
 
interface RequestWithUser extends Request {
  user: ResponseUserDTO;
}
 
export default RequestWithUser;