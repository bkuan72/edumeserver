import HttpException from "./HttpException";

class DbCreatingNewUserAccountException extends HttpException {
  constructor(user_id: string,
              account_id: string) {
    super(500, `Error creating user account for User Id ${user_id} Account Id ${account_id}`);
  }
}

export default DbCreatingNewUserAccountException;