import { IsString, IsUUID } from "class-validator";

export class UserPayloadDto {
  @IsString()
  username: string;

  @IsUUID()
  id: string;
}
