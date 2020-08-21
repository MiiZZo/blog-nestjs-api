import { Controller, Post, Get, Body, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserDto, PublicUserDto } from "./dto/user.dto";
import { IReq } from "@shared/request.interface";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<PublicUserDto[]> {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req: IReq): Promise<UserDto> {
    return await this.usersService.getMe(req.user.id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }
}
