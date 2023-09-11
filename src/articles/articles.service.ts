import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article } from '@prisma/client';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { EditArticleDto } from './dto/EditArticleDto.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {};

  async getArticles(): Promise<Article[]> {
    return this.prisma.article.findMany({
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getArticleById(articleId: number): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },

      include: {
        author: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article with defined id not found');
    }

    return article;
  }

  async editArticle(
    userId: number,
    articleId: number,
    dto: EditArticleDto,
  ) {
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId
      }
    });

    // check if user owns article
    if (!article || article.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.article.update({
      where: {
        id: articleId
      },
      data: {
        ...dto
      },
    });
  }
  
  async createArticle(userId: number, dto: CreateArticleDto) {
    const newArticle = await this.prisma.article.create({
      data: {
        userId,
        ...dto
      },
      include: {
        author: true
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
