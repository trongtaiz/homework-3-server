import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '@components/posts/entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  async getAllPostsInClass(classId: number) {
    return this.postsRepository.find({
      order: {
        date: 'DESC',
      },
      where: { class_id: classId },
    });
  }
}
