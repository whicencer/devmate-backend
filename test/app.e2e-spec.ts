import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { SignupDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { SigninDto } from '../src/auth/dto/signin.dto';
import { CreateArticleDto } from 'src/articles/dto/createArticle.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.clearDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  });

  // Auth
  describe('Auth', () => {
    // Signup
    describe('Signup', () => {
      const signupDto: SignupDto = {
        email: 'test@test.com',
        fullname: 'Test Test',
        password: '12345678',
        username: 'test'
      };

      it('should signup', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });

      it('should throw if email is empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            fullname: 'Test',
            password: '12345678',
            username: 'test'
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            fullname: 'Test',
            email: 'test@test.com',
            username: 'test'
          })
          .expectStatus(400);
      });

      it('should throw if email field is not an email', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            fullname: 'Test',
            email: 'test',
            password: '12345678',
            username: 'test'
          })
          .expectStatus(400);
      });
    });

    // Signin
    describe('Signin', () => {
      const signinDto: SigninDto = {
        username: 'test',
        password: '12345678'
      };

      it('should signin', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });

      it('should throw if no password', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: 'test',
          })
          .expectStatus(400);
      });

      it('should throw if no username', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: '12345678',
          })
          .expectStatus(400);
      });
    });
  });

  // Articles
  describe('Articles', () => {
    // Create
    const createArticleDto: CreateArticleDto = {
      content: 'Test',
    };

    describe('Create article', () => {
      it('should create article', async () => {
        return await pactum
          .spec()
          .post('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody(createArticleDto)
          .expectStatus(201)
          .stores('articleId', 'id');;
      });
      it('should throw if no body', async () => {
        return await pactum
          .spec()
          .post('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(400);
      });
      it('should throw if no token in header', async () => {
        return await pactum
          .spec()
          .post('/articles')
          .withBody(createArticleDto)
          .expectStatus(401);
      });
    });

    //Get
    describe('Get articles', () => {
      it('should return all articles', async () => {
        return await pactum
          .spec()
          .get('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });

      it('throw error if no auth token provided', async () => {
        return await pactum
          .spec()
          .get('/articles')
          .expectStatus(401);
      });
    });

    // Get by id
    describe('Get article by id', () => {
      it('should return article', async () => {
        return await pactum
          .spec()
          .get('/articles/{articleId}')
          .withPathParams('articleId', '$S{articleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });

      it('throw error if no auth token provided', async () => {
        return await pactum
          .spec()
          .get('/articles/{articleId}')
          .withPathParams('articleId', '$S{articleId}')
          .expectStatus(401);
      });
    });

    // Delete article
    describe('Delete article', () => {
      it('should delete', async () => {
        return await pactum
          .spec()
          .delete('/articles/{articleId}')
          .withPathParams('articleId', '$S{articleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204);
      });
      it('throw error if no auth token provided', async () => {
        return await pactum
          .spec()
          .delete('/articles/{articleId}')
          .withPathParams('articleId', '$S{articleId}')
          .expectStatus(401);
      });
      it('throw error if no article with specified id found', async () => {
        return await pactum
          .spec()
          .delete('/articles/131324')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(403);
      });
      it('should get empty articles', async () => {
        return await pactum
          .spec()
          .get('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });
});
