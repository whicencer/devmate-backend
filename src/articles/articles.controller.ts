import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Article } from "@prisma/client";

import { Authorize } from '../decorators/Authorize.decorator';
import { ArticleService } from "./articles.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { GetUser } from "../decorators";

@Controller("articles")
@Authorize()
export class ArticlesController {
  constructor(private readonly articlesService: ArticleService) {}

  @Get()
  async getArticles(): Promise<Article[]> {
    return this.articlesService.getArticles();
  }

  @Post()
  async createArticle(@GetUser("id") userId: number, @Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(userId, dto);
  }

  @Delete(":articleId")
  async deleteArticle(@Param("articleId", ParseIntPipe) articleId: number, @GetUser('id') userId: number) {
    return this.articlesService.deleteArticle(articleId, userId);
  }
}
