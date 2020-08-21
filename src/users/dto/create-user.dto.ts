import { IsEmail, Matches, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(2, 30)
  username: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password: string;
}
