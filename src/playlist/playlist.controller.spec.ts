import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('PlaylistController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'TestUser',
        email: 'testuser@example.com',
        password: 'Teszt123!',
      });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Teszt123!',
      });

    token = loginRes.body.access_token;
  });

  it('should create a new playlist', async () => {
    const response = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Test Playlist',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('My Test Playlist');
  });

  afterAll(async () => {
    await app.close();
  });
});
