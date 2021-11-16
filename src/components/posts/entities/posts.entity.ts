import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  class_id!: number;

  @Column()
  author_id!: number;

  @Column()
  name!: string;

  @Column()
  content!: string;

  @Column()
  author_img!: string;

  @CreateDateColumn()
  date!: Date;
}
