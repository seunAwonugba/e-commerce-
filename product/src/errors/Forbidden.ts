import { StatusCodes } from "http-status-codes";
import CustomErrorHandler from "./CustomErrorhandler";

class Forbidden extends CustomErrorHandler {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default Forbidden;
