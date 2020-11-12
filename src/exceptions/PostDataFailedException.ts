import HttpException from "./HttpException";

class PostDataFailedException extends HttpException {
  constructor( ) {
    super(404, `Post Data Failed!`);
  }
}

export default PostDataFailedException;