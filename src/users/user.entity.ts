import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  JoinTable,
  ManyToMany
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Article } from "src/articles/article.entity";
import { Role } from "@shared/typings/role";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "consumer" })
  role: Role;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "text" })
  bio: string;

  @Column({ default: "" })
  image: string;

  @BeforeInsert()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password);
  }

  @ManyToMany(() => Article)
  @JoinTable()
  favorites: Article[];

  @OneToMany(
    () => Article,
    article => article.author
  )
  articles: Article[];
}
