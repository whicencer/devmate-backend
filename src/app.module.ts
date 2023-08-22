import { Module } from '@nestjs/common';
import { ArticleModule } from 'src/articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ArticleModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
