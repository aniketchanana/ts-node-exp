import { Container } from "inversify";
import { Types } from "./DiTypes";
import { IUserService, UserService } from "./modules/user/service/UserService";
import {
  IUserRepository,
  UserRepository,
} from "./modules/user/repository/UserRepository";
import {
  UserController,
  IUserController,
} from "./modules/user/controller/UserController";
import { AppDataSource, IUserModel } from "./data/interfaces";
import { UserTable } from "./data/tables/UserTable";

const dIContainer = new Container();

// DB tables
dIContainer.bind<AppDataSource<IUserModel>>(Types.USER_TABLE).to(UserTable);

// For auth service module
dIContainer.bind<IUserService>(Types.USER_SERVICE).to(UserService);
dIContainer.bind<IUserRepository>(Types.USER_REPOSITORY).to(UserRepository);
dIContainer.bind<IUserController>(Types.USER_CONTROLLER).to(UserController);

export { dIContainer };
