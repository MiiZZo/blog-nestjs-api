import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Follow } from "./follow.entity";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { User } from "src/users/user.entity";
import { Article } from "src/articles/article.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User, Article])],
  controllers: [ProfilesController],
  providers: [ProfilesService]
})
export class ProfilesModule {}
