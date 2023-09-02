import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":articleId")
  async deleteArticle(@GetUser('id') userId: number, @Param("articleId", ParseIntPipe) articleId: number) {
    return this.articlesService.deleteArticle(articleId, userId);
  }
}
