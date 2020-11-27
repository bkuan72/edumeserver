import { ResponseUserDTO } from '../dtos/ResponseUserDTO';
import HttpException from "./HttpException";

class InvalidUserStatusException extends HttpException {
  constructor(user: ResponseUserDTO) {
    super(501, `User ${user.data.user_name} Not Authorized : ${user.data.status}`);
  }
}

export default InvalidUserStatusException;