import { AGGREGATE_ERROR, ECONNREFUSED } from "../constants/constant";
import { BadRequest } from "../errors";

export const tryCatchError = (error: any) => {
    if (error.response) {
        throw new BadRequest(error.response.data?.message);
    } else if (error.request) {
        if (error.name == AGGREGATE_ERROR) {
            throw new BadRequest(ECONNREFUSED);
        } else {
            throw new BadRequest(error);
        }
    } else {
        throw new BadRequest(error.message);
    }
};
