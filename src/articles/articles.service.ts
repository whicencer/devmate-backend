import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article } from '@prisma/client';
import { CreateArticleDto } from './dto/createArticle.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {};

  async getArticles(): Promise<Article[]> {
    return this.prisma.article.findMany({});
  }
  
  async createArticle(userId: number, dto: CreateArticleDto) {
    const newArticle = await this.prisma.article.create({
      data: {
        userId,
        ...dto
      }
    });

    return newArticle;
  }

  async deleteArticle(articleId: number, userId: number) {
    const articleById = await this.prisma.article.findUnique({
      where: {
        id: articleId
      }
    });

    if (!articleById || articleById.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.article.delete({
      where: {
        id: articleId
      }
    });
  }
}
