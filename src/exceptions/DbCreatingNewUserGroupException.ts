import HttpException from "./HttpException";

class DbCreatingNewUserGroupException extends HttpException {
  constructor(user_id: string,
              group_id: string) {
    super(500, `Error creating user group for User Id ${user_id} Group Id ${group_id}`);
  }
}

export default DbCreatingNewUserGroupException;