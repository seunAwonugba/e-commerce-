import CustomErrorHandler from "./CustomErrorhandler";
import { StatusCodes } from "http-status-codes";

class Unauthenticated extends CustomErrorHandler {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default Unauthenticated;
