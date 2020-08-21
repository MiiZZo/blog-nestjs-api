import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as config from "config";
import { UserPayloadDto } from "../dto/user-payload.dto";
import { JwtDto } from "../dto/jwt.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET")
    });
  }

  async validate({ username, id }: JwtDto): Promise<UserPayloadDto> {
    return { username, id };
  }
}
