import { IUserService } from "../service/UserService";
import { Request, Response } from "express";
import { StatusCode } from "../../../constants/statusCode";
import { validateSignInRequest, validateSignUpRequest } from "./reqValidations";
import { AuthMessages, CommonMessages } from "../../../constants/messages";
import config from "../../../../config";
import { AuthenticatedRequest } from "../../../common/types";
import { IUserModel } from "../../../data/interfaces";
import { inject, injectable } from "inversify";
import { Types } from "../../../DiTypes";
export interface IUserController {
  signIn: (req: Request, res: Response) => Promise<Response>;
  signUp: (req: Request, res: Response) => Promise<Response>;
  logOut: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  isValidSession: (
    req: AuthenticatedRequest,
    res: Response
  ) => Promise<Response>;
}

const CookieSetterOptions = {
  httpOnly: false,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days,
};

if (config.NODE_ENV === "production") {
  CookieSetterOptions["sameSite"] = "none";
  CookieSetterOptions["secure"] = true;
}
@injectable()
export class UserController implements IUserController {
  @inject(Types.USER_SERVICE) private userService: IUserService;

  public async signIn(req: Request, res: Response): Promise<Response> {
    const validationRes = validateSignInRequest(req.body);
    if (!validationRes.valid) {
      return res.status(StatusCode.BAD_REQUEST).json({
        title: validationRes.errors[0].message,
        description: CommonMessages.INVALID_REQ_BODY,
      });
    }
    try {
      const { emailId, password } = req.body;
      const loggedInUser = await this.userService.signInUser(emailId, password);
      if (!loggedInUser) {
        throw new Error(AuthMessages.UNABLE_TO_SIGN_IN);
      }
      return res
        .cookie("access_token", loggedInUser.token, CookieSetterOptions)
        .status(StatusCode.SUCCESS)
        .json({ access_token: loggedInUser.token });
    } catch (e) {
      if (e.message === AuthMessages.UNABLE_TO_SIGN_IN) {
        return res.status(StatusCode.UN_AUTHORIZED).send({
          title: e.message,
          description: AuthMessages.INVALID_CREDENTIALS,
        });
      }
      return res.status(StatusCode.SERVER_ERROR).json({
        title: e.message,
        description: AuthMessages.INVALID_CREDENTIALS,
      });
    }
  }

  public async signUp(req: Request, res: Response): Promise<Response> {
    const userDetails = req.body.userDetails as IUserModel;
    const validationRes = validateSignUpRequest(req.body);
    if (!validationRes.valid) {
      return res.status(StatusCode.BAD_REQUEST).json({
        title: validationRes.errors[0].message,
        description: CommonMessages.INVALID_REQ_BODY,
      });
    }

    try {
      const newUser = await this.userService.createUserAndGenerateAuthToken(
        userDetails.name,
        userDetails.emailId,
        userDetails.password
      );
      return res
        .cookie("access_token", newUser.token, CookieSetterOptions)
        .status(StatusCode.RESOURCE_CREATED)
        .json({ access_token: newUser.token });
    } catch (e) {
      return res.status(StatusCode.SERVER_ERROR).json({
        title: e.message,
        description: CommonMessages.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async logOut(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        throw new Error();
      }
      await this.userService.clearUserAuthToken(req.user._id);
      return res
        .clearCookie("access_token")
        .status(StatusCode.SUCCESS)
        .json({});
    } catch (e) {
      return res.status(StatusCode.UN_AUTHORIZED).json({
        title: AuthMessages.INVALID_USER,
      });
    }
  }

  public async isValidSession(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    if (!req.user) {
      return res.status(StatusCode.UN_AUTHORIZED).json({
        title: AuthMessages.INVALID_USER,
      });
    }
    return res.status(StatusCode.SUCCESS).json({});
  }
}
