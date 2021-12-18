import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('SocialAuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('me', () => {
    test('should return 401 code, if user is Unauthorized', () => {
      return request(app.getHttpServer())
        .get('/user/me')
        .expect(401)
        .expect((res) => {
          console.log(res);
        });
    });
  });
  test.todo('editProfile');
  test.todo('seeRandomProfile');
  test.todo('seeUserById');
  test.todo('getMyPlace');
});
