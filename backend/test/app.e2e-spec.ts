import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: request.SuperTest<request.Test>; 

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    // 完全避免 try-catch，直接使用 .expect() 断言
    const response = await agent
      .get('/invalid-route')
      .expect(404);
    
    // 如果需要检查响应内容
    expect(response.text).toContain('Not Found');
  });
});