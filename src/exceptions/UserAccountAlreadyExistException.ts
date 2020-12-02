import HttpException from "./HttpException";

class UserAccountAlreadyExistsException extends HttpException {
  constructor(user_id: string,
              account_id: string) {
    super(409, `User Id ${user_id} Account Id ${account_id} Already Exist`);
  }
}

export default UserAccountAlreadyExistsException;