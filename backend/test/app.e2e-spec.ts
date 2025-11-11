import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Response } from 'supertest';

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

  /**
   * 类型谓词：明确判断错误是否符合 supertest 断言失败的结构
   */
  function isSupertestError(err: unknown): err is { status: number; response: Response } {
    return (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      'response' in err &&
      typeof (err as { status: number }).status === 'number' &&
      typeof (err as { response: unknown }).response === 'object' &&
      (err as { response: unknown }).response !== null
    );
  }

  it('/invalid-route (GET) should return 404', async () => {
    try {
      await agent.get('/invalid-route').expect(404);
    } catch (err: unknown) {
      if (isSupertestError(err)) {
        expect(err.status).toBe(404);
        // 安全地访问 response.text
        if ('text' in err.response && typeof err.response.text === 'string') {
          expect(err.response.text).toContain('Not Found');
        } else {
          // 如果 response 没有 text 属性，我们可以检查其他属性或抛出错误
          throw new Error('Expected response to have text property');
        }
      } else {
        throw err;
      }
    }
  });
});