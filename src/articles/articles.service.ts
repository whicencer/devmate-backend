import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {};

  async getArticles(): Promise<Article[]> {
    return this.prisma.article.findMany({});
  }
  
  async createArticle() {
    return 'create article';
  }
}
