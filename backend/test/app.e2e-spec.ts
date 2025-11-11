import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'; // 修正拼写
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
    
    // 添加类型断言
    agent = request(app.getHttpServer()) as request.SuperTest<request.Test>;
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