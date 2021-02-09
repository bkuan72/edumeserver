import { UserData } from './../schemas/users.schema';
import { ResponseUserDTO } from "../dtos/userDTO";
import HttpException from "./HttpException";

class ExpiredTokenException extends HttpException {
    constructor(user: ResponseUserDTO | UserData) {
      super(440, `User ${user.user_name} Used Expired Authentication Token`);
    }
  }

export default ExpiredTokenException;