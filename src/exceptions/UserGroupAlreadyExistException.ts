import HttpException from "./HttpException";

class UserGroupAlreadyExistsException extends HttpException {
  constructor(user_id: string,
              group_id: string) {
    super(409, `User Id ${user_id} Group Id ${group_id} Already Exist`);
  }
}

export default UserGroupAlreadyExistsException;