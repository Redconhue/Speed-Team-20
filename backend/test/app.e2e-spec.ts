import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: request.SuperTest<request.Test>; // 修正类型

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      }).compile();
    app = moduleFixture.createNestApplication(); // 修正拼写错误
    await app.init();
    agent = request(app.getHttpServer());
  });
  afterEach(async () => {
    await app.close();
  });
  it('/ (GET)', async () => {
    const response = await agent.get('/').expect(200);
    expect(response.text).toBe('Hello World!');
  });
  it('/invalid-route (GET) should return 404', async () => {
    const response = await agent
    .get('/invalid-route')
    .expect(404);
    expect(response.text).toContain('Not Found');
  });
});