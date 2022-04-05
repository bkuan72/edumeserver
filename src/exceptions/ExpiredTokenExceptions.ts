import { UserData } from './../schemas/users.schema';
import { ResponseUserDTO } from "../dtos/user.DTO";
import HttpException from "./HttpException";

class ExpiredTokenException extends HttpException {
    constructor(user: ResponseUserDTO | UserData) {
      super(440, `User ${user.username} Used Expired Authentication Token`);
    }
  }

export default ExpiredTokenException;