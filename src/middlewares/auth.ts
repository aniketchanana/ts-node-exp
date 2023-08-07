import config from "../../config";
import { AuthMessages } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { AppDataSource, IUserModel } from "../data/interfaces";
import jwt from "jsonwebtoken";
import { dIContainer } from "../inversify.config";
import { Types } from "../DiTypes";

export const getAuthMiddleWare = () => {
  const userTable: AppDataSource<IUserModel> = dIContainer.get<
    AppDataSource<IUserModel>
  >(Types.USER_TABLE);

  return async (req, res, next) => {
    try {
      const token = req.headers.cookie.split("=")[1];
      const decoded = jwt.verify(token, config.JWT) as { emailId: string };
      const user = await userTable.findOne({
        emailId: decoded.emailId,
        token: token,
      });
      if (!user) {
        throw new Error();
      }
      req.token = token;
      req.user = user;
    } catch (e) {
      return res
        .status(StatusCode.UN_AUTHORIZED)
        .send({ title: AuthMessages.INVALID_USER });
    }
    next();
  };
};
