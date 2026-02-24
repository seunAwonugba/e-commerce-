import CustomErrorHandler from "./CustomErrorhandler";
import { StatusCodes } from "http-status-codes";

class BadRequest extends CustomErrorHandler {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
