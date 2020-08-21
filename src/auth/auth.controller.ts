import { Controller, Post, UseGuards, Req, Res, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { IReq } from "@shared/request.interface";
import { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshJwtAuthGuard } from "./guards/refresh-jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get("ping")
  async ping(): Promise<null> {
    return null;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post("update-tokens")
  async updateTokens(
    @Req() req: IReq,
    @Res() res: Response<string>
  ): Promise<void> {
    const tokens = await this.authService.createTokens(req.user);

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      signed: true
    });

    res.json(tokens.access_token).status(201);
  }

  @UseGuards(LocalAuthGuard)
  @Post("sign-in")
  async login(@Req() req: IReq, @Res() res: Response<string>): Promise<void> {
    const tokens = await this.authService.createTokens(req.user);

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      signed: true
    });

    res.json(tokens.access_token).status(201);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get("logout")
  async logout(@Res() res: Response): Promise<void> {
    res.cookie("refresh_token", null, { maxAge: 0 });

    res.end();
  }
}
