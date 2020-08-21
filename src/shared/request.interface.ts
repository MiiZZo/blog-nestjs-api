import { Request } from "express";

export interface IReq extends Request {
  user: any;
}
