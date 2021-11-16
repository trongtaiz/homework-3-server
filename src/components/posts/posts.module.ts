import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '@components/posts/entities/posts.entity';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Posts])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
