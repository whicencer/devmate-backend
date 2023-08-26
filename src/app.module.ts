import { Module } from '@nestjs/common';
import { ArticleModule } from './articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ArticleModule,
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
