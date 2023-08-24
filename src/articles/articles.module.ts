import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticleService } from './articles.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticleModule {}
