import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { SignupDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { SigninDto } from '../src/auth/dto/signin.dto';

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
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.clearDb();
    pactum.request.setBaseUrl(
      'http://localhost:3000',
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
          .expectStatus(201);
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
});
