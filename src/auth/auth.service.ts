import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as config from "config";
import { UsersService } from "src/users/users.service";
import { UserPayloadDto } from "./dto/user-payload.dto";
import { match } from "assert";

type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async createTokens(payload: UserPayloadDto): Promise<Tokens> {
    return {
      access_token: this.jwtService.sign(payload, {
        secret: config.get("JWT_SECRET"),
        expiresIn: "15min"
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: config.get("JWT_SECRET"),
        expiresIn: "30days"
      })
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const matchPassword = bcrypt.compareSync(password, user.password);

    if (matchPassword) {
      return { username, id: user.id };
    }

    return null;
  }
}
