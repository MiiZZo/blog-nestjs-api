import { PublicUserDto } from "src/users/dto/user.dto";
import { Comment } from "../comment.entity";

export class ArticleDto {
  id: string;
  title: string;
  description: string;
  body: string;
  created: Date;
  updated: Date;
  author: PublicUserDto;
  comments: Comment[];
}
