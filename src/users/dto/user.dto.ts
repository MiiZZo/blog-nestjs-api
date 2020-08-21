import { Article } from "src/articles/article.entity";

export interface PublicUserDto {
  username: string;
  bio: string;
  image: string;
  favorites: Article[];
  articles: Article[];
}

export interface UserDto extends PublicUserDto {
  email: string;
}
