import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SuperTest, Test as SuperTestTest, Response, RequestError } from 'supertest';

// 自定义错误类型接口，明确supertest错误的结构
interface SupertestError {
  status: number;
  response: { text: string };
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: SuperTest<SuperTestTest>;

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
    const response = await agent.get('/').expect(200) as Response;
    expect(response.text).toBe('Hello World!');
  });

  it('/invalid-route (GET) should return 404', async () => {
    try {
      await agent.get('/invalid-route').expect(404);
    } catch (err) {
      // 精确断言错误类型为自定义的SupertestError
      const error = err as SupertestError;
      expect(error.status).toBe(404);
      expect(error.response.text).toContain('Not Found');
    }
  });
});