import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'tesztuser',
        email: 'tesztuser@example.com',
        password: 'Teszt123!',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'tesztuser@example.com');
  });

  it('should not register user with weak password', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'baduser',
        email: 'bad@example.com',
        password: 'weak',
      });

    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
