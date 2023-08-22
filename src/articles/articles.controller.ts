import { Controller, Get, Post } from '@nestjs/common';
import { Article } from '@prisma/client';
import { ArticleService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Get()
  async getArticles(): Promise<Article[]> {
    return this.articlesService.getArticles();
  }
  
  @Post()
  async createArticle() {
    return this.articlesService.createArticle();
  }
}
