import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Follow } from "./follow.entity";
import { Repository, DeepPartial } from "typeorm";
import { User } from "src/users/user.entity";
import { ProfileRO, ProfileData } from "./profile.interface";
import { Article } from "src/articles/article.entity";
import { PublicUserDto } from "src/users/dto/user.dto";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Article) private articlesRepository: Repository<Article>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(username: string): Promise<PublicUserDto> {
    return await this.usersRepository.findOne(
      { username },
      { select: ["id", "image", "bio", "username"], relations: ["articles"] }
    );
  }

  async findProfile(id: string, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.usersRepository.findOne({
      username: followingUsername
    });

    if (!_profile) return;

    const profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image
    };

    const follows = await this.followsRepository.findOne({
      followerId: id,
      followingId: _profile.id
    });

    if (id) {
      profile.following = !!follows;
    }

    return { profile };
  }

  async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    const followingUser = await this.usersRepository.findOne({ username });
    const followerUser = await this.usersRepository.findOne({
      email: followerEmail
    });

    if (followingUser.email === followerEmail) {
      throw new BadRequestException(
        "FollowerEmail and FollowingId cannot be equal."
      );
    }

    const _follows = await this.followsRepository.findOne({
      followerId: followerUser.id,
      followingId: followingUser.id
    });

    if (!_follows) {
      const follows = new Follow();
      follows.followerId = followerUser.id;
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
    }

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true
    };

    return { profile };
  }

  async unFollow(followerId: string, username: string): Promise<ProfileRO> {
    const followingUser = await this.usersRepository.findOne({ username });

    if (followingUser.id === followerId) {
      throw new BadRequestException(
        "FollowerId and FollowingId cannot be equal."
      );
    }
    const followingId = followingUser.id;
    await this.followsRepository.delete({ followerId, followingId });

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false
    };

    return { profile };
  }
}
