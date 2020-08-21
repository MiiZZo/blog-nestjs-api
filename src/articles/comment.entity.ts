import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Article } from "./article.entity";
import { User } from "src/users/user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  body: string;

  @ManyToOne(
    () => User,
    user => user.articles
  )
  author: User;

  @ManyToOne(
    () => Article,
    article => article.comments,
    { onUpdate: "CASCADE", onDelete: "CASCADE" }
  )
  article: Article;
}
