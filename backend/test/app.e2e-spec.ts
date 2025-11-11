import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Response } from 'supertest';
import { fail } from 'assert';

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
    try {
      await agent.get('/invalid-route').expect(404);
    } catch (err: unknown) {
      // 类型保护：先运行时检查err的结构，再安全断言类型
      if (typeof err === 'object' && err !== null && 'status' in err && 'response' in err) {
        const error = err as { status: number; response: Response };
        expect(error.status).toBe(404);
        expect(error.response.text).toContain('Not Found');
      } else {
        fail('Unexpected error type (expected { status, response })');
      }
    }
  });
});