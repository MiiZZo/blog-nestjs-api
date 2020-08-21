import { Controller, Post, Delete, Param, Req, Get } from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { Request } from "express";
import { PublicUserDto } from "src/users/dto/user.dto";

@Controller("profiles")
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get(":username")
  async get(@Param("username") username: string): Promise<PublicUserDto> {
    return this.profilesService.findOne(username);
  }

  @Post(":username/follow")
  async follow(
    @Req() req: Request,
    @Param("username") username: string
  ): Promise<void> {
    await this.profilesService.follow((req as any).user.name, username);
  }

  @Delete(":username/follow")
  async unfollow(
    @Req() req: Request,
    @Param("username") username: string
  ): Promise<void> {
    await this.profilesService.unFollow((req as any).user.name, username);
  }
}
