import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Follow {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  followerId: string;

  @Column()
  followingId: string;
}
