import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { User } from "src/users/user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ default: "", length: 200 })
  description: string;

  @Column({ type: "text" })
  body: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp(): void {
    this.updated = new Date();
  }

  @ManyToOne(
    () => User,
    user => user.articles
  )
  author: User;

  @OneToMany(
    () => Comment,
    comment => comment.article,
    { eager: true }
  )
  @JoinColumn()
  comments: Comment[];

  @Column({ default: 0 })
  favoriteCount: number;
}
