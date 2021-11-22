import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { Controller, Get, UseInterceptors, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@UseInterceptors(WrapResponseInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private classesService: PostsService) {}

  @Get('/all/:class_id')
  getAllPostsInClass(@Param() params) {
    return this.classesService.getAllPostsInClass(params.class_id);
  }
}
