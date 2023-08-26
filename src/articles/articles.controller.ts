import { Controller, Get, Post } from '@nestjs/common';
import { Article } from '@prisma/client';

import { ArticleService } from './articles.service';
<<<<<<< HEAD
import { Authorize } from 'src/decorators';
=======
import { Authorize } from '../decorators/Authorize.decorator';
>>>>>>> feature-auth

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Authorize()
  @Get()
  async getArticles(): Promise<Article[]> {
    return this.articlesService.getArticles();
  }
  
  @Authorize()
  @Post()
  async createArticle() {
    return this.articlesService.createArticle();
  }
}
