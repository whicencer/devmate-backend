import { Controller, Get, Post } from '@nestjs/common';
import { Article } from '@prisma/client';

import { ArticleService } from './articles.service';
import { Authorize } from 'src/decorators/Authorize.decorator';

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
