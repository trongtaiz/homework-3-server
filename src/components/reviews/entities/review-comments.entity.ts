import { AbstractEntity } from '@common/entities/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ReviewComments')
export default class ReviewCommentEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column()
  @Index()
  reviewId!: string;

  @Column()
  from!: string;

  @Column()
  content!: string;
}
