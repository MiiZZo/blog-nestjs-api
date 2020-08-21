import { SetMetadata, CustomDecorator } from "@nestjs/common";
import { Role } from "./typings/role";

export const Roles = (role: Role): CustomDecorator<string> =>
  SetMetadata("role", role);
