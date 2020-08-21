import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as config from "config";
import { UserPayloadDto } from "../dto/user-payload.dto";
import { IReq } from "@shared/request.interface";
import { JwtDto } from "../dto/jwt.dto";

function cookieExtractor(req: IReq) {
  let token = null;

  if (req.signedCookies) {
    token = req.signedCookies["refresh_token"];
  }

  return token;
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET")
    });
  }

  async validate({ username, id }: JwtDto): Promise<UserPayloadDto> {
    return { username, id };
  }
}
