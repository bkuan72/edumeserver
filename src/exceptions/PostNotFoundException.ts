import HttpException from "./HttpException";

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(400, `Post with id ${id} not found`);
  }
}

export default PostNotFoundException;