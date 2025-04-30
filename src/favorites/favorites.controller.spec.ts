import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('FavoritesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should add a song to favorites', async () => {
    const response = await request(app.getHttpServer())
    .post('/favorites')
    .set('Authorization', 'Bearer <VALID_TOKEN>')
    .send({
      user_id: 1,
      song_id: 2,
    });
  

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  afterAll(async () => {
    await app.close();
  });
});
