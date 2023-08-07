export interface Projection {
  [key: string]: 1 | 0;
}
export interface IUserModel {
  _id: string;
  name: string;
  emailId: string;
  password: string;
  token?: string;
}
export type IPublicUser = Omit<IUserModel, "password">;
export interface AppDataSource<T> {
  create(data: T): Promise<T>;
  bulkInsert(records: T[]): Promise<T[]>;
  findOne(filter: Partial<T>, project?: Projection): Promise<T>;
  findMany(filter: Partial<T>, project?: Projection): Promise<T[]>;
  findOneAndUpdate(filter: Partial<T>, updates: Partial<T>): Promise<T>;
}
