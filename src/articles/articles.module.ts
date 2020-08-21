import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { Comment } from "./comment.entity";
import { User } from "src/users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, User])],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {}
