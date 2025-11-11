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
    // 直接使用 .expect() 来断言状态码，不需要 try-catch
    await agent.get('/invalid-route').expect(404);
  });

  // 如果需要验证 404 响应的内容，可以使用这种方式
  it('/invalid-route (GET) should return 404 with correct message', async () => {
    const response = await agent
      .get('/invalid-route')
      .expect(404);
    
    // 直接检查响应文本
    expect(response.text).toContain('Not Found');
  });
});