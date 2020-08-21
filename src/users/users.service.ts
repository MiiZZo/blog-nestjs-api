import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { PublicUserDto, UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async getAll(): Promise<PublicUserDto[]> {
    return this.usersRepository.find({
      relations: ["articles"],
      select: ["username", "id", "image"]
    });
  }

  async getMe(id: string): Promise<UserDto> {
    return await this.usersRepository.findOne(
      { id },
      { select: ["id", "username", "image", "email", "bio"], relations: ["articles"] }
    );
  }

  async findOne(username: string): Promise<User> {
    return await this.usersRepository.findOne({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const userWithMatchEmail = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: createUserDto.email })
      .getOne();

    if (userWithMatchEmail) {
      throw new BadRequestException("User with this email already registered");
    }

    const userWithMatchUsername = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username = :username", { username: createUserDto.username })
      .getOne();

    if (userWithMatchUsername) {
      throw new BadRequestException(
        "User with this username already registered"
      );
    }

    const newUser = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(newUser);
  }
}
