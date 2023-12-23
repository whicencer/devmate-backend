import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { Article } from "@prisma/client";

import { Authorize } from '../decorators/Authorize.decorator';
import { ArticleService } from "./articles.service";
import { CreateArticleDto } from "./dto/CreateArticle.dto";
import { GetUser } from "../decorators";
import { EditArticleDto } from "./dto/EditArticleDto.dto";

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

  @Get(":articleId")
  async getArticleById(@Param("articleId", ParseIntPipe) articleId): Promise<Article> {
    return this.articlesService.getArticleById(articleId);
  }

  @Patch(":articleId")
  async editArticle(
    @GetUser('id') userId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() dto: EditArticleDto,
  ) {
    return await this.articlesService.editArticle(userId, articleId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":articleId")
  async deleteArticle(@GetUser('id') userId: number, @Param("articleId", ParseIntPipe) articleId: number) {
    return this.articlesService.deleteArticle(articleId, userId);
  }

  @Post("like/:articleId")
  async likeArticle(@GetUser('id') userId: number, @Param("articleId", ParseIntPipe) articleId: number) {
    return this.articlesService.likeArticle(articleId, userId);
  }
}
