import { IUser } from "../../src/models/User"; // adjust path if needed
import { Document } from "mongoose";
import { UserDocument } from "../../src/models/User";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
